import { IAdapter, IResult } from '../../repositories/types';
import { LABEL, URL_PARAM_NAME } from './nav-config.data';
import { IService } from './service.model';
import { COLLECTION } from './search-metadata.data';

export const servicesAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (service: Partial<IService> & { id: string }): IResult => ({
    id: service.id,
    // basic information
    title: service.name_t || '',
    description: service.description_t || '',
    type: LABEL,
    url: service.pid_s
      ? `https://marketplace.eosc-portal.eu/services/${service.pid_s}`
      : '',
    typeUrlPath: URL_PARAM_NAME,
    collection: COLLECTION,
    tags: [
      {
        label: 'Scientific domain',
        value: service.scientific_domains_ss || [],
        filter: 'scientific_domains_ss',
      },
      {
        label: 'Organisation',
        value: service.resource_organisation_s || '',
        filter: 'resource_organisation_s',
      },
    ],
  }),
};
