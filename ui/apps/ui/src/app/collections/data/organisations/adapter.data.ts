import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IOrganisation } from '@collections/data/organisations/organisation.model';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { ConfigService } from '../../../services/config.service';

export const organisationsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    organisation: Partial<IOrganisation> & { id: string }
  ): IResult => ({
    id: organisation.id,
    type: {
      label: 'organisation',
      value: 'organisation',
    },
    tags: [
      {
        label: 'Country',
        values: toValueWithLabel(toArray(organisation.country)),
        filter: 'country',
      },
    ],
    collection: COLLECTION,
    title: organisation.title ?? '',
    abbreviation: organisation.abbreviation ?? '',
    website: organisation.url ?? '',
    redirectUrl: `${
      ConfigService.config?.eosc_explore_url
    }/search/organization?organizationId=${organisation?.id
      ?.split('|')
      ?.pop()}`,
    coloredTags: [],
    secondaryTags: [],
    description: '',
    isResearchProduct: false,
    relatedPublicationNumber: organisation.related_publication_number ?? 0,
    relatedSoftwareNumber: organisation.related_software_number ?? 0,
    relatedDatasetNumber: organisation.related_dataset_number ?? 0,
    relatedOtherNumber: organisation.related_other_number ?? 0,
    relatedProjectNumber: organisation.related_project_number ?? 0,
  }),
};
