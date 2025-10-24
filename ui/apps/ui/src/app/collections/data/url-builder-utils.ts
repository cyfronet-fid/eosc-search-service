import { ConfigService } from '../../services/config.service';
import { IDataSource } from './data-sources/data-source.model';
import { IService } from './services/service.model';
import { IProvider } from './providers/provider.model';
import { ICatalogue } from './catalogues/catalogue.model';
import { IBundle } from './bundles/bundle.model';
import { IOpenAIREResult } from './openair.model';
import { ITraining } from './trainings/training.model';
import { IGuideline } from './guidelines/guideline.model';
import { IAdapterModel } from './adapters/adapter.model';
import { IDeployableServiceModel } from '@collections/data/deployable-services/deployable-service.model';

// Type for entities that can have pid/slug identifiers
// Using union instead of intersection to avoid conflicting property types
type IdentifiableEntity = Partial<
  | IDataSource
  | IService
  | IProvider
  | ICatalogue
  | IBundle
  | IOpenAIREResult
  | ITraining
  | IGuideline
  | IAdapterModel
  | IDeployableServiceModel
> & {
  pid?: string;
  slug?: string;
  id?: string;
  service_id?: string | number;
};

/**
 * Gets the preferred identifier from an entity, falling back from pid to slug
 */
export const getEntityIdentifier = (entity: {
  pid?: string;
  slug?: string;
}): string => {
  return entity.pid || entity.slug || '';
};

/**
 * Builds marketplace URLs for different resource types
 */
export const buildMarketplaceUrl = (
  resourceType: 'services' | 'providers' | 'catalogues' | 'deployable_services',
  identifier: string,
  path: string = ''
): string => {
  const baseUrl = ConfigService.config?.marketplace_url;
  const encodedIdentifier = encodeURIComponent(identifier);
  return `${baseUrl}/${resourceType}/${encodedIdentifier}${path}`;
};

/**
 * Builds service URLs with pid/slug fallback
 */
export const buildServiceUrl = (
  entity: { pid?: string; slug?: string },
  path: string = ''
): string => {
  const identifier = getEntityIdentifier(entity);
  return buildMarketplaceUrl('services', identifier, path);
};

/**
 * Builds provider URLs with pid/slug fallback
 */
export const buildProviderUrl = (
  entity: { pid?: string; slug?: string },
  path: string = ''
): string => {
  const identifier = getEntityIdentifier(entity);
  return buildMarketplaceUrl('providers', identifier, path);
};

/**
 * Builds catalogue URLs with pid/slug fallback
 */
export const buildCatalogueUrl = (
  entity: { pid?: string; slug?: string },
  path: string = ''
): string => {
  const identifier = getEntityIdentifier(entity);
  return buildMarketplaceUrl('catalogues', identifier, path);
};

/**
 * Builds adapter URLs with pid/slug fallback
 */
export const buildAdapterUrl = (entity: {
  logoUrl?: string;
}): string | undefined => {
  return entity.logoUrl;
};

/**
 * Builds catalogue URLs with pid/slug fallback
 */
export const buildDeployableServiceUrl = (
  entity: { slug?: string; pid?: string },
  path: string = ''
): string => {
  const identifier = entity.slug || entity.pid || '';
  return buildMarketplaceUrl('deployable_services', identifier, path);
};

/**
 * Gets the main URL for an entity based on its type
 */
export const getEntityUrl = (
  type: string,
  entity: IdentifiableEntity & { service_id?: string | number; id?: string }
): string => {
  switch (type) {
    case 'dataset':
    case 'publication':
    case 'software':
    case 'other':
      return `${
        ConfigService.config?.eosc_explore_url
      }/search/result?id=${encodeURIComponent(
        entity.id?.split('|')?.pop() || ''
      )}`;

    case 'data source':
    case 'service':
      return buildServiceUrl(entity);

    case 'bundle':
      return buildMarketplaceUrl('services', String(entity.service_id || ''));

    case 'provider':
      return buildProviderUrl(entity);

    case 'catalogue':
      return buildCatalogueUrl(entity);

    case 'deployable service':
      return buildDeployableServiceUrl(entity);
    case 'training':
      return '/trainings/' + encodeURIComponent(entity.id || '');

    case 'interoperability guideline':
      return '/guidelines/' + encodeURIComponent(entity.id || '');

    case 'adapter':
      return '/adapters/' + encodeURIComponent(entity?.id || '');

    default:
      return '';
  }
};

/**
 * Gets the logo URL for an entity based on its type
 */
export const getEntityLogoUrl = (
  type: string,
  entity: { pid?: string; slug?: string },
  logoUrl?: string
): string | undefined => {
  switch (type) {
    case 'data source':
    case 'service':
      return buildServiceUrl(entity, '/logo');

    case 'provider':
      return buildProviderUrl(entity, '/logo');

    case 'catalogue':
      return buildCatalogueUrl(entity, '/logo');

    case 'adapter':
      return buildAdapterUrl({
        logoUrl: logoUrl,
      });

    default:
      return undefined;
  }
};

/**
 * Gets the order URL for an entity based on its type
 */
export const getEntityOrderUrl = (
  type: string,
  entity: { pid?: string; slug?: string; service_id?: string | number }
): string | undefined => {
  switch (type) {
    case 'data source':
    case 'service':
      return buildServiceUrl(entity, '/offers');

    case 'bundle':
      return buildMarketplaceUrl(
        'services',
        String(entity.service_id || ''),
        '/offers'
      );

    default:
      return undefined;
  }
};
