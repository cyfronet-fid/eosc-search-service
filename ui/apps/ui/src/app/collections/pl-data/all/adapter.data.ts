import { IDataSource } from '../../data/data-sources/data-source.model';
import { ITraining } from '../../data/trainings/training.model';
import { IGuideline } from '../../data/guidelines/guideline.model';
import { IService } from '../../data/services/service.model';
import { IBundle } from '../../data/bundles/bundle.model';
import { IProvider } from '../../data/providers/provider.model';
import { IOpenAIREResult } from '../../data/openair.model';
import {
  allCollectionsAdapter,
  logoUrlAdapter,
  orderUrlAdapter,
  redirectUrlAdapter,
} from '../../data/all/adapter.data';
import { ConfigService } from '../../../services/config.service';

const plRedirectUrlAdapter = (
  type: string,
  data: Partial<
    IOpenAIREResult &
      IDataSource &
      IService &
      ITraining &
      IGuideline &
      IBundle &
      IProvider
  >
) => {
  switch (type) {
    case 'dataset':
      return data?.url?.[0] || '';

    case 'service':
      return data?.slug
        ? `${ConfigService.config?.pl_marketplace_url}/services/${data.slug}/offers`
        : '';

    case 'data source':
      return data?.pid
        ? `${ConfigService.config?.pl_marketplace_url}/services/${data.pid}/offers`
        : '';

    default:
      // Use the original redirectUrlAdapter for all other cases
      return redirectUrlAdapter(type, data);
  }
};

const plLogoUrlAdapter = (
  type: string,
  data: Partial<
    IOpenAIREResult &
      IDataSource &
      IService &
      ITraining &
      IGuideline &
      IBundle &
      IProvider
  >
) => {
  switch (type) {
    case 'data source':
      return data.pid
        ? `${ConfigService.config?.pl_marketplace_url}/services/${data.pid}/logo`
        : '';
    case 'service':
      return data.slug
        ? `${ConfigService.config?.pl_marketplace_url}/services/${data.slug}/logo`
        : '';
    default:
      // Use the original redirectUrlAdapter for all other cases
      return logoUrlAdapter(type, data);
  }
};

export const plOrderUrlAdapter = (
  type: string,
  data: Partial<
    IOpenAIREResult &
      IDataSource &
      IService &
      ITraining &
      IGuideline &
      IBundle &
      IProvider
  >
) => {
  switch (type) {
    case 'data source':
      return data.pid
        ? `${ConfigService.config?.pl_marketplace_url}/services/${data.pid}/offers`
        : '';
    case 'service':
      return data.slug
        ? `${ConfigService.config?.pl_marketplace_url}/services/${data.slug}/offers`
        : '';
    default:
      return orderUrlAdapter(type, data);
  }
};

export const plAllCollectionsAdapter = {
  ...allCollectionsAdapter,
  adapter: (
    data: Partial<
      IOpenAIREResult &
        ITraining &
        IDataSource &
        IService &
        IGuideline &
        IBundle &
        IProvider
    > & {
      id: string;
    }
  ) => {
    const result = allCollectionsAdapter.adapter(data);

    return {
      ...result,
      redirectUrl: plRedirectUrlAdapter(data.type || '', data), // Override the redirectUrl
      logoUrl: plLogoUrlAdapter(data.type || '', data),
      orderUrl: plOrderUrlAdapter(data.type || '', data),
    };
  },
};
