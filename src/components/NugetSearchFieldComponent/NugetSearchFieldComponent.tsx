import React from 'react';
import { FieldProps, FieldValidation } from '@rjsf/core';
import FormControl from '@material-ui/core/FormControl';
import { KubernetesValidatorFunctions } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { NugetPackage, nugetSearchApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';

type PackageListProps = {
  packages: NugetPackage[];
};

const PackageList = (props: PackageListProps) => (
  <ul>
    {
      props.packages.map(v => (<li key={v.id}>{v.title}</li>))
    }
  </ul>
)

/*
 This is the actual component that will get rendered in the form
*/
export const NugetSearchFieldComponent = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldProps<string>) => {

  const api = useApi(nugetSearchApiRef);

  const { value, loading, error } = useAsync(async (): Promise<NugetPackage[]> => {
    const packages = await api.makeRequest('Intility');
    return packages.data;
  }, []);
  
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (value?.length === 0 || !value) {
    return <Alert severity='warning'>No package found</Alert>
  }

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
      onChange={onChange}
    >
      <PackageList packages={value} />
    </FormControl>
  );
};

/*
 This is a validation function that will run when the form is submitted.
  You will get the value from the `onChange` handler before as the value here to make sure that the types are aligned\
*/

export const myCustomValidation = (
  value: string,
  validation: FieldValidation,
) => {
  if (!KubernetesValidatorFunctions.isValidObjectName(value)) {
    validation.addError(
      'must start and end with an alphanumeric character, and contain only alphanumeric characters, hyphens, underscores, and periods. Maximum length is 63 characters.',
    );
  }
};
