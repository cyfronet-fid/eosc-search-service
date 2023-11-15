import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IOpenAIREResult } from '@collections/data/openair.model';
import {
  constructIdentifierTag,
  formatPublicationDate,
} from '@collections/data/utils';
import { IDataSource } from '@collections/data/data-sources/data-source.model';
import { ITraining } from '@collections/data/trainings/training.model';
import { IGuideline } from '@collections/data/guidelines/guideline.model';
import { IService } from '@collections/data/services/service.model';
import {
  getDataSourceOrderUrl,
  getDataSourceUrl,
} from '@collections/data/data-sources/adapter.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toBetaTag,
  transformLanguages,
} from '@collections/data/shared-tags';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';
import { IBundle } from '@collections/data/bundles/bundle.model';
import { IProvider } from '@collections/data/providers/provider.model';

const urlAdapter = (
  type: string,
  data: Partial<
    IOpenAIREResult &
      IDataSource &
      IService &
      ITraining &
      IGuideline &
      IBundle &
      IProvider
  >
) => {
  switch (type) {
    case 'dataset':
    case 'publication':
    case 'software':
    case 'other':
      return `${
        ConfigService.config?.eosc_explore_url
      }/search/result?id=${data?.id?.split('|')?.pop()}`;
    case 'data source':
      return getDataSourceUrl(data?.pid);
    case 'service':
      return `${ConfigService.config?.marketplace_url}/services/${data?.pid}`;
    case 'training':
      return '/trainings/' + data.id;
    case 'interoperability guideline':
      return '/guidelines/' + data.id;
    case 'bundle':
      return `${ConfigService.config?.marketplace_url}/services/${data.service_id}`;
    case 'provider':
      return `${ConfigService.config?.marketplace_url}/providers/${data?.pid}`;
    default:
      return '';
  }
};

const orderUrlAdapter = (
  type: string,
  data: Partial<
    IOpenAIREResult &
      IDataSource &
      IService &
      ITraining &
      IGuideline &
      IBundle &
      IProvider
  >
) => {
  switch (type) {
    case 'data source':
      return getDataSourceOrderUrl(data?.pid);
    case 'service':
      return data.pid
        ? `${ConfigService.config?.marketplace_url}/services/${data.pid}/offers`
        : undefined;
    case 'bundle':
      return `${ConfigService.config?.marketplace_url}/services/${data.service_id}/offers`;
    default:
      return undefined;
  }
};

const forInteroperabilityGuidelinesValueAdapter = (value: string = '') => {
  const valueToLowerCase = value.toLowerCase();
  return valueToLowerCase.indexOf('interoperability') !== -1
    ? 'guideline'
    : value;
};

const extractDate = (
  data: Partial<
    IOpenAIREResult &
      IDataSource &
      IService &
      ITraining &
      IGuideline &
      IBundle &
      IProvider
  >
) => {
  switch (data.type) {
    case 'interoperability guideline':
      return data['publication_year']
        ? data['publication_year'].toString()
        : '';
    case 'publication':
    case 'software':
    case 'dataset':
    case 'training':
    case 'other':
      return formatPublicationDate(data['publication_date']);
    default:
      return undefined;
  }
};

const setIsResearchProduct = (
  data: Partial<
    IOpenAIREResult &
      IDataSource &
      IService &
      ITraining &
      IGuideline &
      IBundle &
      IProvider
  >
) => {
  switch (data.type) {
    case 'publication':
    case 'software':
    case 'dataset':
    case 'other':
      return true;
    default:
      return false;
  }
};

export const allCollectionsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    data: Partial<
      IOpenAIREResult &
        ITraining &
        IDataSource &
        IService &
        IGuideline &
        IBundle &
        IProvider
    > & {
      id: string;
    }
  ): IResult => ({
    isSortCollectionScopeOff: true,
    isSortByRelevanceCollectionScopeOff: true,
    isSortByPopularityCollectionScopeOff: false,
    isResearchProduct: setIsResearchProduct(data),
    id: data.id,
    title: data?.title?.join(' ') || '',
    description: data?.description?.join(' ') || '',
    documentType: data?.document_type,
    date: extractDate(data),
    languages: transformLanguages(data?.language),
    url: urlAdapter(data.type || '', data),
    orderUrl: orderUrlAdapter(data.type || '', data),
    urls: data.url,
    horizontal: data?.horizontal,
    coloredTags: [],
    tags:
      data.type === 'bundle'
        ? []
        : [
            {
              label: 'Author',
              values: toValueWithLabel(toArray(data?.author_names)),
              filter: 'author_names',
              showMoreThreshold: 10,
            },
            {
              label: 'Organisation',
              values: toValueWithLabel(toArray(data?.resource_organisation)),
              filter: 'resource_organisation',
            },
            {
              label: 'Scientific domain',
              values: toValueWithLabel(toArray(data?.scientific_domains)),
              filter: 'scientific_domains',
            },
            {
              label: 'Identifier',
              values: constructIdentifierTag(data?.pids),
              filter: 'doi',
              showMoreThreshold: 4,
            },
          ],
    type: {
      label: data.type === 'bundle' ? 'bundles' : data.type || '',
      value: forInteroperabilityGuidelinesValueAdapter(data.type)?.replace(
        / +/gm,
        '-'
      ),
    },
    collection: COLLECTION,
    secondaryTags: [
      // toDownloadsStatisticsSecondaryTag(data.usage_counts_downloads),
      // toViewsStatisticsSecondaryTag(data.usage_counts_views),
      toKeywordsSecondaryTag(data.keywords ?? [], 'keywords'),
      toKeywordsSecondaryTag(data.tag_list ?? [], 'tag_list'),
    ],
    offers: data.offers ?? [],
    ...parseStatistics(data),
  }),
};
