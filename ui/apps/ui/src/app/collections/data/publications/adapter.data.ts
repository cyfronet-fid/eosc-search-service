import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IOpenAIREResult } from '../openair.model';
import { COLLECTION } from './search-metadata.data';
import { last } from 'lodash-es';
import moment from 'moment';

export const publicationsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    openAIREResult: Partial<IOpenAIREResult> & { id: string }
  ): IResult => ({
    id: openAIREResult.id,
    title: openAIREResult?.title?.join(' ') || '',
    description: openAIREResult?.description?.join(' ') || '',
    date: openAIREResult['publication_date']
      ? moment(openAIREResult['publication_date']).format('DD MMMM YYYY')
      : '',
    url: `https://explore.eosc-portal.eu/search/result?id=${openAIREResult?.id
      ?.split('|')
      ?.pop()}`,
    coloredTag: [
      {
        value: last(openAIREResult?.best_access_right) || '',
        filter: 'best_access_right',
        colorClassName: (last(openAIREResult?.best_access_right) || '').match(
          /open(.access)?/gi
        )
          ? 'tag-light-green'
          : 'tag-light-coral',
      },
      {
        colorClassName: 'tag-almond',
        value: openAIREResult['license'] || [],
        filter: 'license',
      },
      {
        colorClassName: 'tag-peach',
        filter: 'language',
        value: openAIREResult?.language || [],
      },
    ],
    tags: [
      {
        label: 'Author names',
        value: openAIREResult?.author_names || [],
        filter: 'author_names',
      },
      {
        label: 'Publisher',
        value: openAIREResult?.publisher || '',
        filter: 'publisher',
      },
      {
        label: 'Field of science',
        value: openAIREResult?.fos || [],
        filter: 'fos',
      },
      {
        label: 'Document type',
        value: openAIREResult?.document_type || '',
        filter: 'document_type',
      },
    ],
    type: openAIREResult?.type || '',
    typeUrlPath: URL_PARAM_NAME,
    collection: COLLECTION,
  }),
};
