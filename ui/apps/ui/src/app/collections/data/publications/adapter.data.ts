import { IAdapter, IResult } from '../../repositories/types';
import { LABEL, URL_PARAM_NAME } from './nav-config.data';
import { IOpenAIREResult } from '../openair.model';
import { COLLECTION } from './search-metadata.data';
import { last } from 'lodash-es';

export const publicationsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    openAIREResult: Partial<IOpenAIREResult> & { id: string }
  ): IResult => ({
    id: openAIREResult.id,
    title: openAIREResult?.title?.join(' ') || '',
    description: openAIREResult?.description?.join(' ') || '',
    date: openAIREResult?.published?.pop(),
    url: `https://explore.eosc-portal.eu/search/result?id=${openAIREResult?.id
      ?.split('|')
      ?.pop()}`,
    tags: [
      {
        label: 'Author names',
        value: openAIREResult.author_names || [],
        filter: 'author_names',
      },
    ],
    coloredTag: [
      {
        label: last(openAIREResult?.bestaccessright) || '',
        value: last(openAIREResult?.bestaccessright) || '',
        filter: 'bestaccessright',
        colorClassName:
          (last(openAIREResult?.bestaccessright) || '').toLowerCase() ===
          'open access'
            ? 'tag-light-green'
            : 'tag-light-coral',
      },
    ],
    type: LABEL,
    typeUrlPath: URL_PARAM_NAME,
    collection: COLLECTION,
  }),
};
