import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const guidelinesFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'author_names',
      filter: 'author_names',
      label: 'Creator Name',
      type: 'tag',
    },
    {
      id: 'right_id',
      filter: 'right_id',
      label: 'License',
      type: 'tag',
    },
    {
      id: 'keywords',
      filter: 'keywords',
      label: 'Keywords',
      type: 'tag',
    },
    {
      id: 'resource_type_general',
      filter: 'resource_type_general',
      label: 'Resource Type Category',
      type: 'multiselect',
    },
    {
      id: 'status',
      filter: 'status',
      label: 'Status',
      type: 'multiselect',
    },
    {
      id: 'domain',
      filter: 'domain',
      label: 'Domain',
      type: 'multiselect',
    },
    {
      id: 'eosc_guideline_type',
      filter: 'eosc_guideline_type',
      label: 'Guideline Type',
      type: 'multiselect',
    },
    {
      id: 'provider',
      filter: 'provider',
      label: 'Publisher',
      type: 'multiselect',
    },
  ],
};

/*
 EIG.BAI.15 should be used in the [RESOURCE] filter
 Publisher (bringing in data from EIG.BAI.04)
 Status (EIG.BAI.23)
 Domain (EIG.BAI.24)
 Guideline Type (EIG.BAI.25)
* */
