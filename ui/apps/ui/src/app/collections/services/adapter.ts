import { IService } from './service.model';
import { IResult } from '../../result/result.model';

export const serviceToResult = (
  service: Partial<IService>,
  typeUrlPath: string,
  collection: string
): IResult => ({
  title: service.name_t || '',
  description: service.description_t || '',
  Organisation: service.resource_organisation_s || '',
  'Scientific domain': service.scientific_domains_ss || '',
  type: 'Service',
  url: service.slug_s
    ? `https://marketplace.eosc-portal.eu/services/${service.slug_s}`
    : '',
  typeUrlPath,
  collection,
  fieldToFilter: resultToServiceFilter,
  fieldsToTags: ['Scientific domain', 'Organisation'],
});
export const resultToServiceFilter = {
  'Scientific domain': 'scientific_domains_ss',
  Organisation: 'resource_organisation_s',
  Provider: 'providers_ss',
};

export const serviceFilterToField = {
  providers_ss: 'Provider',
  scientific_domains_ss: 'Scientific domain',
  resource_organisation_s: 'Organisation',
  geographical_availabilities_ss: 'Country',
  categories_ss: 'Categories',
};
