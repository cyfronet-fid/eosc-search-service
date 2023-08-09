import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { IGuideline } from '@collections/data/guidelines/guideline.model';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';

export const guidelinesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (guideline: Partial<IGuideline> & { id: string }): IResult => ({
    isSortByRelevanceCollectionScopeOff: true,
    id: uuidv4(),
    title: guideline['title']?.join(' ') || '',
    description: guideline['description']?.join(' ') || '',
    date: guideline['publication_year']
      ? guideline['publication_year'].toString()
      : '',
    type: {
      label: guideline['type'] || '',
      value: 'guideline',
    },
    collection: COLLECTION,
    url: '/guidelines/' + guideline.id || '',
    coloredTags: [
      {
        colorClassName: 'tag-almond',
        values: toValueWithLabel(toArray(guideline['right_id'])),
        filter: 'right_id',
      },
    ],
    tags: [
      {
        label: 'Provider',
        values: toValueWithLabel(toArray(guideline['provider'])),
        filter: 'provider',
      },
    ],
    secondaryTags: [
      toKeywordsSecondaryTag(guideline.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(guideline),
  }),
};
