import { providersAdapter } from '../../data/providers/adapter.data';
import { IProvider } from '../../data/providers/provider.model';
import { ConfigService } from '../../../services/config.service';

export const plProvidersAdapter = {
  ...providersAdapter,
  adapter: (provider: Partial<IProvider> & { id: string }) => {
    const result = providersAdapter.adapter(provider);
    return {
      ...result,
      redirectUrl: provider.pid
        ? `${ConfigService.config?.pl_marketplace_url}/providers/${provider.pid}`
        : '',
      logoUrl: provider.pid
        ? `${ConfigService.config?.pl_marketplace_url}/providers/${provider.pid}/logo`
        : '',
    };
  },
};
