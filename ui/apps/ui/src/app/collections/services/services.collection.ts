import { CollectionSearchMetadata } from '../collection.model';
import { SolrQueryParams } from '../../search-service/solr-query-params.interface';
import { SERVICES_FACETS } from '../../search-service/facet-param.interface';
import {
  resultToServiceFilter,
  serviceFilterToField,
  serviceToResult,
} from './adapter';
import { IService } from './service.model';

export const servicesCollection = new CollectionSearchMetadata(
  new SolrQueryParams({
    qf: [
      'name_t',
      'resource_organisation_s',
      'tagline_t',
      'scientific_domains_ss',
      // 'tags_ss',
    ],
    collection: 'marketplace',
  }),
  SERVICES_FACETS,
  (item: Partial<IService>) => serviceToResult(item, 'services', 'marketplace'),
  resultToServiceFilter,
  serviceFilterToField,
  'Service'
);
