import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IGuideline } from '@collections/data/guidelines/guideline.model';
import {
  toArray,
  toRelatedService,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';

export const guidelinesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (guideline: Partial<IGuideline> & { id: string }): IResult => ({
    isResearchProduct: false,
    id: guideline.id,
    title: guideline['title']?.join(' ') || '',
    description: guideline['description']?.join(' ') || '',
    license: guideline['right_id'],
    providerName: guideline['providers'],
    relatedServices: toRelatedService(guideline.related_services ?? []),
    date: guideline['publication_year']
      ? guideline['publication_year'].toString()
      : '',
    type: {
      label: guideline['type'] || '',
      value: 'guideline',
    },
    collection: COLLECTION,
    redirectUrl: '/guidelines/' + guideline.id || '',
    coloredTags: [],
    tags: [
      {
        label: 'Provider',
        values: toValueWithLabel(toArray(guideline['providers'])),
        filter: 'providers',
      },
    ],
    secondaryTags: [
      toKeywordsSecondaryTag(guideline.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(guideline),
  }),
};
