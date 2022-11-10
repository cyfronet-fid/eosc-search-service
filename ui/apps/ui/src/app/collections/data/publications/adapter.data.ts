import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IOpenAIREResult } from '../openair.model';
import { COLLECTION } from './search-metadata.data';
import moment from 'moment';
import { parseStatistics } from '@collections/data/utils';
import { toArray, toValueWithLabel } from '@collections/filters-serializers/utils';
import {
  toAccessRightColoredTag,
  toLanguageColoredTag,
} from '@collections/data/shared-tags';

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
    coloredTags: [
      toAccessRightColoredTag(openAIREResult?.best_access_right),
      {
        colorClassName: 'tag-almond',
        values: toValueWithLabel(toArray(openAIREResult['license'])),
        filter: 'license',
      },
      toLanguageColoredTag(openAIREResult?.language),
    ],
    tags: [
      {
        label: 'Author names',
        values: toValueWithLabel(toArray(openAIREResult?.author_names)),
        filter: 'author_names',
      },
      {
        label: 'Publisher',
        values: toValueWithLabel(toArray(openAIREResult?.publisher)),
        filter: 'publisher',
      },
      {
        label: 'Document type',
        values: toValueWithLabel([...new Set(toArray(openAIREResult?.document_type))]),
        filter: 'document_type',
      },
      {
        label: 'DOI',
        values: toValueWithLabel(toArray(openAIREResult?.doi)),
        filter: 'doi',
      },
      {
        label: 'Field of Science',
        values: toValueWithLabel(toArray(openAIREResult?.fos)),
        filter: 'fos',
      },
    ],
    type: {
      label: openAIREResult?.type || '',
      value: openAIREResult?.type || '',
    },
    collection: COLLECTION,
    ...parseStatistics(openAIREResult),
  }),
};
