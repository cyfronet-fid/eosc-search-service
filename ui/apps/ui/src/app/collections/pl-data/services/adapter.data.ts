import { ConfigService } from '../../../services/config.service';
import { servicesAdapter } from '../../data/services/adapter.data';
import { IService } from '../../data/services/service.model';
import { IDataSource } from '../../data/data-sources/data-source.model';

export const plServicesAdapter = {
  ...servicesAdapter,
  adapter: (service: Partial<IService & IDataSource> & { id: string }) => {
    const result = servicesAdapter.adapter(service);
    return {
      ...result,
      redirectUrl: service.slug
        ? `${ConfigService.config?.pl_marketplace_url}/services/${service.slug}/offers`
        : '',
      logoUrl: service.slug
        ? `${ConfigService.config?.pl_marketplace_url}/services/${service.slug}/logo`
        : '',
      orderUrl: service.slug
        ? `${ConfigService.config?.pl_marketplace_url}/services/${service.slug}/offers`
        : '',
    };
  },
};
