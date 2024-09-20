import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { ICatalogue } from './catalogue.model';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { ConfigService } from '../../../services/config.service';
import {
  formatPublicationDate,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';

export const cataloguesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (catalogue: Partial<ICatalogue> & { id: string }): IResult => ({
    id: catalogue.id,
    pid: catalogue.pid,
    type: {
      label: 'catalogue',
      value: 'catalogue',
    },
    tags: [
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(catalogue.scientific_domains)),
        filter: 'scientific_domains',
      },
      {
        label: 'Legal status',
        values: toValueWithLabel(toArray(catalogue.legal_status)),
        filter: 'legal_status',
      },
    ],
    collection: COLLECTION,
    title: catalogue.title ?? '',
    abbreviation: catalogue.abbreviation ?? '',
    description: [catalogue?.description]?.join(' ') || '',
    date: formatPublicationDate(catalogue['publication_date']),
    secondaryTags: [
      toKeywordsSecondaryTag(catalogue.keywords ?? [], 'keywords'),
    ],

    redirectUrl: catalogue.pid
      ? `${ConfigService.config?.eu_marketplace_url}/catalogues/${catalogue.pid}`
      : '',
    coloredTags: [],
    isResearchProduct: false,
  }),
};
