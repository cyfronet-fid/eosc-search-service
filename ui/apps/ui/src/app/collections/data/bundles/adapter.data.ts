import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { IBundle, IOffer } from '@collections/data/bundles/bundle.model';
import { parseStatistics } from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';

function getBundleUrl(bundle: Partial<IBundle> & { id: string }): string {
  if (bundle.iid != null && bundle.iid.length === 1) {
    return `${ConfigService.config?.marketplace_url}/services/${
      bundle.service_id
    }/bundles/${bundle.iid![0]}`;
  }
  return `${ConfigService.config?.marketplace_url}/services/${bundle.service_id}`;
}

export const bundlesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    bundle: Partial<IBundle> & { id: string }
  ): IResult & { offers: IOffer[] } => ({
    isSortCollectionScopeOff: true,
    isSortByRelevanceCollectionScopeOff: true,
    isSortByPopularityCollectionScopeOff: true,
    isResearchProduct: false,
    id: uuidv4(),
    title: bundle['title']?.join(' ') || '',
    description: bundle['description']?.join(' ') || '',
    type: {
      label: 'bundles',
      value: 'bundle',
    },
    collection: COLLECTION,
    url: getBundleUrl(bundle),
    orderUrl: `${ConfigService.config?.marketplace_url}/services/${bundle.service_id}/offers`,
    coloredTags: [],
    tags: [
      {
        label: 'Bundle goal',
        values: toValueWithLabel(toArray(bundle.bundle_goals)),
        filter: 'bundle_goals',
      },
      {
        label: 'Capabilities of goal',
        values: toValueWithLabel(toArray(bundle.capabilities_of_goals)),
        filter: 'capabilities_of_goals',
      },
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(bundle.scientific_domains)),
        filter: 'scientific_domains',
      },
    ],
    offers: bundle.offers ?? [],
    ...parseStatistics(bundle),
  }),
};
