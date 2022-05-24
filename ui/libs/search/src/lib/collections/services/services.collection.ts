import { CollectionSearchMetadata } from '../collection.model';
import { IResult } from '../../result.model';
import { SERVICES_FACETS } from '../../services/search-service/facet-param.interface';
import { IService } from './service.model';
import {SolrQueryParams} from "../../services/search";

export const servicesCollection = new CollectionSearchMetadata(
  new SolrQueryParams({
    qf: [
      'name_t',
      'resource_organisation_s',
      'tagline_t',
      'scientific_domains_ss',
    ],
    collection: 'marketplace',
  }),
  SERVICES_FACETS,
  (
    service: Partial<IService>,
  ): IResult => ({
    // basic information
    title: service.name_t || '',
    description: service.description_t || '',
    type: 'Service',
    url: service.pid_s
      ? `https://marketplace.eosc-portal.eu/services/${service.pid_s}`
      : '',
    typeUrlPath: 'services',
    collection: 'marketplace',
    tags: [
      {
        label: 'Scientific domain',
        value: service.scientific_domains_ss || [],
        originalField: 'scientific_domains_ss'
      },
      {
        label: 'Organisation',
        value: service.resource_organisation_s || '',
        originalField: 'resource_organisation_s'
      }
    ],
  }),
  {
    'Scientific domain': 'scientific_domains_ss',
    Organisation: 'resource_organisation_s',
    Provider: 'providers_ss',
  },
  {
    providers_ss: 'Provider',
    scientific_domains_ss: 'Scientific domain',
    resource_organisation_s: 'Organisation',
    geographical_availabilities_ss: 'Country',
    categories_ss: 'Categories',
  },
  'Service'
);
