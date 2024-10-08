import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IProject } from './project.model';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { toKeywordsSecondaryTag } from '../utils';
import { ConfigService } from '../../../services/config.service';

export const projectsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (project: Partial<IProject> & { id: string }): IResult => ({
    isResearchProduct: false,
    id: project.id,
    title: project.title ?? '',
    abbreviation: project['abbreviation'] ? project['abbreviation'] : '',
    description: project.description ?? '',
    code: project.code ?? '',
    type: {
      label: 'project',
      value: 'project',
    },
    collection: COLLECTION,
    coloredTags: [],
    secondaryTags: [toKeywordsSecondaryTag(project.keywords ?? [], 'keywords')],
    currency: project.currency,
    cost: project.total_cost,
    fundedUnder: project.funding_stream_title ?? '',
    startDate: project.start_date ?? '',
    endDate: project.end_date ?? '',
    tags: [
      {
        label: 'Funder',
        values: toValueWithLabel(toArray(project.funding_title)),
        filter: 'funding_title',
      },
      {
        label: 'Funded under',
        values: toValueWithLabel(toArray(project.funding_stream_title)),
        filter: 'funding_stream_title',
      },
      {
        label: 'Partners',
        values: toValueWithLabel(toArray(project.related_organisation_titles)),
        filter: 'related_organisation_titles',
        showMoreThreshold: 10,
      },
    ],

    redirectUrl: `${
      ConfigService.config?.eosc_explore_url
    }/search/project?projectId=${project?.id?.split('|')?.pop()}`,
    dateRange: project.date_range ?? '',
    yearRange: project.year_range ?? '',
  }),
};
