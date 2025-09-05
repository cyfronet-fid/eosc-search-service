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
  toKeywordsSecondaryTag,
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
    catalogue: rawAdapter?.catalogues,
    releases: rawAdapter?.releases,
    version: rawAdapter?.version,
    date: formatPublicationDate(rawAdapter.publication_date),
    changelog: rawAdapter?.changelog,
    node: rawAdapter?.node,
    programmingLanguage: formatProgrammingLanguage(
      rawAdapter?.programming_language
    ),
    documentationUrl: rawAdapter?.documentation_url,
    repository: rawAdapter?.repository,
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
    collection: COLLECTION,
    type: {
      label: rawAdapter?.type || '',
      value: rawAdapter?.type || '',
    },
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
        values: toArray(rawAdapter.programming_language).map((lang) => ({
          value: lang, // Raw value for filtering
          label: formatProgrammingLanguage(lang), // Formatted label for display
        })),
        filter: 'programming_language',
        showMoreThreshold: 4,
      },
    ],
    secondaryTags: [
      toKeywordsSecondaryTag(rawAdapter.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(rawAdapter),
  }),
};
