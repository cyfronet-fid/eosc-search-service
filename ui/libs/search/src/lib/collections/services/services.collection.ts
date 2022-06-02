import {IService} from './service.model';
import {ICollectionSearchMetadata} from '../../state/results/results.service';
import {IResult} from "../../state/results/results.model";
import {IHasId} from "@eosc-search-service/types";

export const publicationAdapter =  (
  service: Partial<IService> & IHasId,
): IResult => ({
  id: service.id,
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
})


export const servicesCollection: ICollectionSearchMetadata<IService> = {
  type: 'Service',
  inputAdapter: publicationAdapter,
  _hash: '',
  queryMutator: (q: string) => q + '*',
  fieldToFilter: {
    'Scientific domain': 'scientific_domains_ss',
    Organisation: 'resource_organisation_s',
    Provider: 'providers_ss',
  },
  filterToField: {
    providers_ss: 'Provider',
    scientific_domains_ss: 'Scientific domain',
    resource_organisation_s: 'Organisation',
    geographical_availabilities_ss: 'Country',
    categories_ss: 'Categories',
  },
  params: {
    qf: [
      'name_t',
      'resource_organisation_s',
      'tagline_t',
      'scientific_domains_ss',
    ],
    collection: 'marketplace',
  },
  facets: {
    tagline_t: { field: 'tagline_t', type: 'terms' },
    resource_organisation_s: { field: 'resource_organisation_s', type: 'terms' },
    categories_ss: { field: 'categories_ss', type: 'terms' },
    scientific_domains_ss: { field: 'scientific_domains_ss', type: 'terms' },
    providers_ss: { field: 'providers_ss', type: 'terms' },
    platforms_ss: { field: 'platforms_ss', type: 'terms' },
    order_type_s: { field: 'order_type_s', type: 'terms' },
    geographical_availabilities_ss: { field: 'geographical_availabilities_ss', type: 'terms' },
  },
};
