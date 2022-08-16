import { IAdapter, IResult } from '../../repositories/types';
import { LABEL, URL_PARAM_NAME } from './nav-config.data';
import { IOpenAIREResult } from '../openair.model';
import { COLLECTION } from './search-metadata.data';

export const datasetsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    openAIREResult: Partial<IOpenAIREResult> & { id: string }
  ): IResult => ({
    id: openAIREResult.id,
    title: openAIREResult?.title?.join(' ') || '',
    description: openAIREResult?.description?.join(' ') || '',
    url: `https://explore.eosc-portal.eu/search/result?id=${openAIREResult?.id
      ?.split('|')
      ?.pop()}`,
    tags: [
      {
        label: 'Author names',
        value: openAIREResult.author_names || [],
        originalField: 'author_names',
      },
      {
        label: 'Published (date)',
        value: openAIREResult?.published?.pop() || '',
        originalField: 'published',
      },
      {
        label: 'Access right',
        value: openAIREResult?.bestaccessright?.pop() || '',
        originalField: 'bestaccessright',
      },
    ],
    type: LABEL,
    typeUrlPath: URL_PARAM_NAME,
    collection: COLLECTION,
  }),
};
