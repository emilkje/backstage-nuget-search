import { createPlugin, createRoutableExtension, discoveryApiRef } from '@backstage/core-plugin-api';
import { createScaffolderFieldExtension, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { defaultApiFactory } from './api';
import { NugetSearchFieldComponent } from './components/NugetSearchFieldComponent';
import { rootRouteRef } from './routes';

export const nugetSearchPlugin = createPlugin({
  id: 'nuget-search',
  apis: [ defaultApiFactory ],
  routes: {
    root: rootRouteRef,
  },
});

export const NugetSearchPage = nugetSearchPlugin.provide(
  createRoutableExtension({
    name: 'NugetSearchPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

export const NugetSearchField = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'NugetSearchField',
    component: NugetSearchFieldComponent
  })
);