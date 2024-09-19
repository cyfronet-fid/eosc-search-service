import { IDataSource } from '../../data/data-sources/data-source.model';
import { ITraining } from '../../data/trainings/training.model';
import { IGuideline } from '../../data/guidelines/guideline.model';
import { IService } from '../../data/services/service.model';
import { IBundle } from '../../data/bundles/bundle.model';
import { IProvider } from '../../data/providers/provider.model';
import { IOpenAIREResult } from '../../data/openair.model';
import {
  allCollectionsAdapter,
  redirectUrlAdapter,
} from '../../data/all/adapter.data';

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
  if (type === 'dataset') {
    return data?.url?.[0] || '';
  }

  // Use the original redirectUrlAdapter for all other cases
  return redirectUrlAdapter(type, data);
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
    };
  },
};
