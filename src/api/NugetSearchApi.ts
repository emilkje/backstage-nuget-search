import {
  createApiFactory,
  createApiRef,
  DiscoveryApi,
  discoveryApiRef,
} from '@backstage/core-plugin-api';

const DEFAULT_PROXY_PATH = '/nuget-search';

export const nugetSearchApiRef = createApiRef<NugetSearchApi>({
  id: 'plugin.nuget-search.service',
});

export type NugetPackage = {
    id: string;
    title: string;
}

export type NugetSearchResponse = {
    data: NugetPackage[];
}

export class NugetSearchApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPath: string;

  constructor(options: { discoveryApi: DiscoveryApi; proxyPath?: string }) {
    this.discoveryApi = options.discoveryApi;
    this.proxyPath = options.proxyPath ?? DEFAULT_PROXY_PATH;
  }

  async makeRequest(query: string): Promise<NugetSearchResponse> {
    const url = await this.getApiUrl();
    return fetch(`${url}/query?q=${query}&prerelease=false&semVerLevel=2.0.0`)
        .then(res => res.json());
  }

  private async getApiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }
}

export const defaultApiFactory = createApiFactory({
  api: nugetSearchApiRef,
  deps: { discoveryApi: discoveryApiRef },
  factory: ({ discoveryApi }) => new NugetSearchApi({ discoveryApi }),
});
