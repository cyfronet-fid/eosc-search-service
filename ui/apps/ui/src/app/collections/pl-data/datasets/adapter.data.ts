import { datasetsAdapter } from '../../data/datasets/adapter.data';
import { IOpenAIREResult } from '../../data/openair.model';

export const plDatasetsAdapter = {
  ...datasetsAdapter,
  adapter: (openAIREResult: Partial<IOpenAIREResult> & { id: string }) => {
    const result = datasetsAdapter.adapter(openAIREResult);
    return {
      ...result,
      redirectUrl: openAIREResult?.url?.[0] || '', // Override the redirectUrl
    };
  },
};
