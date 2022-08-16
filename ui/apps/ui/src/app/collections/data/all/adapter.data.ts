import { IAdapter, IResult } from '../../repositories/types';
import { LABEL, URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';

export const allCollectionsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (openAIREResult: { id: string }): IResult => ({
    id: openAIREResult.id,
    title: '',
    description: '',
    url: '',
    tags: [],
    type: LABEL,
    typeUrlPath: URL_PARAM_NAME,
    collection: COLLECTION,
  }),
};
