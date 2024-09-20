import { ConfigService } from '../../../services/config.service';
import { IDataSource } from '../../data/data-sources/data-source.model';
import { dataSourcesAdapter } from '../../data/data-sources/adapter.data';

export const plDataSourcesAdapter = {
  ...dataSourcesAdapter,
  adapter: (dataSource: Partial<IDataSource> & { id: string }) => {
    const result = dataSourcesAdapter.adapter(dataSource);
    return {
      ...result,
      redirectUrl: dataSource.pid
        ? `${ConfigService.config?.pl_marketplace_url}/services/${dataSource.pid}/offers`
        : '',
      logoUrl: dataSource.pid
        ? `${ConfigService.config?.pl_marketplace_url}/services/${dataSource.pid}/logo`
        : '',
      orderUrl: dataSource.pid
        ? `${ConfigService.config?.pl_marketplace_url}/services/${dataSource.pid}/offers`
        : '',
    };
  },
};
