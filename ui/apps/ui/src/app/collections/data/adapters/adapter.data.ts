import { IAdapter, IResult } from '../../repositories/types';
import { COLLECTION } from './search-metadata.data';
import { URL_PARAM_NAME } from './nav-config.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  formatLicense,
  formatProgrammingLanguage,
  formatPublicationDate,
  parseStatistics,
} from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';
import { IAdapterModel } from '@collections/data/adapters/adapter.model';

export const adaptersAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (rawAdapter: Partial<IAdapterModel> & { id: string }): IResult => ({
    isResearchProduct: false,
    id: rawAdapter.id,
    title: rawAdapter?.title?.join(' ') || '',
    description: rawAdapter?.description?.join(' ') || '',
    license: formatLicense(rawAdapter?.license),
    date: formatPublicationDate(rawAdapter.last_update),
    changelog: rawAdapter?.changelog,
    node: rawAdapter?.node,
    programmingLanguage: formatProgrammingLanguage(
      rawAdapter?.programming_language
    ),
    documentationUrl: rawAdapter?.documentation_url,
    logoUrl: rawAdapter?.logo,
    relatedServiceUrl:
      rawAdapter?.related_services && rawAdapter?.related_services?.length > 0
        ? `${
            ConfigService.config?.marketplace_url
          }/services/${encodeURIComponent(rawAdapter.related_services[0])}`
        : undefined,
    relatedGuidelineUrl:
      rawAdapter?.related_guidelines &&
      rawAdapter?.related_guidelines?.length > 0
        ? '/guidelines/' + encodeURIComponent(rawAdapter.related_guidelines[0])
        : undefined,
    url: '/adapters/' + encodeURIComponent(rawAdapter?.id) || '',
    coloredTags: [],
    tags: [
      {
        label: 'EOSC Node',
        values: toValueWithLabel(toArray(rawAdapter.node)),
        filter: 'node',
        showMoreThreshold: 4,
      },
      {
        label: 'Programming language',
        values: toValueWithLabel(toArray(rawAdapter.programming_language)),
        filter: 'programming_language',
        showMoreThreshold: 4,
      },
    ],
    type: {
      label: rawAdapter?.type || '',
      value: rawAdapter?.type || '',
    },
    collection: COLLECTION,
    secondaryTags: [],
    ...parseStatistics(rawAdapter),
  }),
};
