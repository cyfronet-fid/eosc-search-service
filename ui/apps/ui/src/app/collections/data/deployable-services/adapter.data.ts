import { IAdapter, IResult } from '../../repositories/types';
import { COLLECTION } from './search-metadata.data';
import { URL_PARAM_NAME } from './nav-config.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  formatPublicationDate,
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { IDeployableServiceModel } from '@collections/data/deployable-services/deployable-service.model';
import { buildDeployableServiceUrl } from '@collections/data/url-builder-utils';

export const deployableServiceAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    deployableService: Partial<IDeployableServiceModel> & { id: string }
  ): IResult => ({
    isResearchProduct: false,
    id: deployableService.id,
    title: deployableService?.title?.join(' ') || '',
    description: deployableService?.description?.join(' ') || '',
    catalogue: deployableService?.catalogues,
    version: deployableService?.version,
    date: formatPublicationDate(deployableService.publication_date),
    node: deployableService?.node,
    url: buildDeployableServiceUrl(deployableService),
    license: deployableService?.license,
    collection: COLLECTION,
    type: {
      label: deployableService?.type || '',
      value: deployableService?.type || '',
    },
    coloredTags: [],
    tags: [
      {
        label: 'EOSC Node',
        values: toValueWithLabel(toArray(deployableService.node)),
        filter: 'node',
        showMoreThreshold: 4,
      },
      {
        label: 'Organisation',
        values: toValueWithLabel(
          toArray(deployableService.resource_organisation)
        ),
        filter: 'resource_organisation',
      },
      {
        label: 'Authors',
        values: toValueWithLabel(toArray(deployableService.creator_names)),
        filter: 'creator_names',
        showMoreThreshold: 4,
      },
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(deployableService.scientific_domains)),
        filter: 'scientific_domains',
      },
    ],
    secondaryTags: [
      toKeywordsSecondaryTag(deployableService.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(deployableService),
  }),
};
