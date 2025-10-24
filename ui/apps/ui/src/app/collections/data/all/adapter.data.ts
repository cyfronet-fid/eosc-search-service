import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IOpenAIREResult } from '@collections/data/openair.model';
import {
  constructIdentifierTag,
  formatPublicationDate,
  toInterPatternsSecondaryTag,
} from '@collections/data/utils';
import { IDataSource } from '@collections/data/data-sources/data-source.model';
import { ITraining } from '@collections/data/trainings/training.model';
import { IGuideline } from '@collections/data/guidelines/guideline.model';
import { IService } from '@collections/data/services/service.model';
import { IAdapterModel } from '@collections/data/adapters/adapter.model';
import { IDeployableServiceModel } from '@collections/data/deployable-services/deployable-service.model';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transformLanguages,
} from '@collections/data/shared-tags';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { IBundle } from '@collections/data/bundles/bundle.model';
import { IProvider } from '@collections/data/providers/provider.model';
import {
  getEntityLogoUrl,
  getEntityOrderUrl,
  getEntityUrl,
} from '../url-builder-utils';

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
      IProvider &
      IAdapterModel &
      IDeployableServiceModel
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
    case 'adapter':
    case 'deployable service':
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
      IProvider &
      IAdapterModel &
      IDeployableServiceModel
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
        IProvider &
        IAdapterModel &
        IDeployableServiceModel
    > & {
      id: string;
    }
  ): IResult => ({
    isResearchProduct: setIsResearchProduct(data),
    id: data.id,
    title: data?.title?.join(' ') || '',
    description: data?.description?.join(' ') || '',
    documentType: data?.document_type,
    date: extractDate(data),
    languages: transformLanguages(data?.language),
    url: getEntityUrl(data.type || '', data),
    logoUrl: getEntityLogoUrl(data.type || '', data, data.logo),
    orderUrl: getEntityOrderUrl(data.type || '', data),
    exportData: data.exportation || [],
    urls: data.url,
    horizontal: data?.horizontal,
    license: data?.license,
    funder: data?.funder,
    coloredTags: [],
    relatedOrganisations: data?.related_organisation_titles || [],
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
              label: 'EOSC Node',
              values: toValueWithLabel(toArray(data?.node)),
              filter: 'node',
              showMoreThreshold: 4,
            },
            {
              label: 'Organisation',
              values: toValueWithLabel(toArray(data?.resource_organisation)),
              filter: 'resource_organisation',
            },
            {
              label: 'Authors',
              values: toValueWithLabel(toArray(data.creator_names)),
              filter: 'creator_names',
              showMoreThreshold: 4,
            },
            {
              label: 'Identifier',
              values: constructIdentifierTag(data?.pids),
              filter: 'pids',
              showMoreThreshold: 4,
            },
            {
              label: 'Scientific domain',
              values: toValueWithLabel(toArray(data?.scientific_domains)),
              filter: 'scientific_domains',
            },
            {
              label: 'Interoperability guideline',
              values: toValueWithLabel(toArray(data.guidelines)),
              filter: 'guidelines_str',
            },
            {
              label: 'Related organisations',
              values: toValueWithLabel(
                toArray(data?.related_organisation_titles)
              ),
              filter: 'related_organisation_titles',
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
      toInterPatternsSecondaryTag(data.eosc_if ?? [], 'eosc_if'),
      toKeywordsSecondaryTag(data.keywords ?? [], 'keywords'),
    ],
    offers: data.offers ?? [],
    ...parseStatistics(data),
  }),
};
