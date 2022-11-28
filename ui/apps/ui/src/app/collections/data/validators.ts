import {
  IAdapter,
  ICollectionNavConfig,
  ICollectionSearchMetadata,
  IFiltersConfig,
} from '@collections/repositories/types';
import { differenceWith, isEqual } from 'lodash-es';

export const validateCollections = (
  filters: IFiltersConfig[],
  navConfigs: ICollectionNavConfig[],
  searchMetadata: ICollectionSearchMetadata[]
): void => {
  _validateComponentsIntegrity(filters, navConfigs, searchMetadata);
  _validateLabelsConsistency(navConfigs);
  _validateBreadcrumbs(navConfigs);
  // should be enabled when fixed
  // _validateFiltersConsistency(searchMetadata, filters, [allCollectionsAdapter]);
};

// PRIVATE
export const _validateComponentsIntegrity = (
  filters: IFiltersConfig[],
  navConfigs: ICollectionNavConfig[],
  searchMetadata: ICollectionSearchMetadata[]
): void => {
  const filtersUniqueIds = [...new Set(filters.map(({ id }) => id))];
  const navConfigsUniqueIds = [...new Set(navConfigs.map(({ id }) => id))];
  const searchMetadataUniqueIds = [
    ...new Set(searchMetadata.map(({ id }) => id)),
  ];

  const allUniqueIds = [
    ...new Set([
      ...filtersUniqueIds,
      ...navConfigsUniqueIds,
      ...searchMetadataUniqueIds,
    ]),
  ];

  const urlPaths = navConfigs.map(({ urlParam }) => urlParam);
  if (!isEqual(urlPaths, allUniqueIds)) {
    const missingUrlPaths = differenceWith(allUniqueIds, urlPaths, isEqual);
    throw Error(
      `[COLLECTIONS VALIDATOR]: Collections components ids needs to be application url param, for: ${missingUrlPaths}`
    );
  }

  if (!isEqual(filtersUniqueIds, allUniqueIds)) {
    const missingFilters = differenceWith(
      allUniqueIds,
      filtersUniqueIds,
      isEqual
    );
    throw Error(
      `[COLLECTIONS VALIDATOR]: There are missing filters, for: ${missingFilters}`
    );
  }
  if (!isEqual(navConfigsUniqueIds, allUniqueIds)) {
    const missingNavConfigs = differenceWith(
      allUniqueIds,
      navConfigsUniqueIds,
      isEqual
    );
    throw Error(
      `[COLLECTIONS VALIDATOR]: There are missing navConfigs, for: ${missingNavConfigs}`
    );
  }
  if (!isEqual(searchMetadataUniqueIds, allUniqueIds)) {
    const missingSearchMetadata = differenceWith(
      allUniqueIds,
      searchMetadataUniqueIds,
      isEqual
    );
    throw Error(
      `[COLLECTIONS VALIDATOR]: There are missing adapters, for: ${missingSearchMetadata}`
    );
  }

  // eslint-disable-next-line no-restricted-syntax
  console.info(
    '[COLLECTIONS VALIDATOR]: All collections components are full-filled.'
  );
};

export const _validateLabelsConsistency = (
  navConfigs: ICollectionNavConfig[]
) => {
  navConfigs.forEach(({ id, title, breadcrumbs }) => {
    const lastBreadcrumb = breadcrumbs.slice(-1)[0];
    if (title !== lastBreadcrumb.label) {
      throw Error(
        `[COLLECTIONS VALIDATOR]: Nav config (${id}) have different labels for title (${title}) and last breadcrumb (${lastBreadcrumb.label}).`
      );
    }
  });

  // eslint-disable-next-line no-restricted-syntax
  console.info('[COLLECTIONS VALIDATOR]: Collections labels are consistent.');
};

export const _validateBreadcrumbs = (navConfigs: ICollectionNavConfig[]) => {
  navConfigs.forEach(({ id, title, breadcrumbs }) => {
    const lastBreadcrumbLabel = breadcrumbs.slice(-1)[0].label;
    if (lastBreadcrumbLabel !== title) {
      throw Error(
        `[COLLECTIONS VALIDATOR]: Last breadcrumb and collection title needs to be same, for: ${id}`
      );
    }

    const otherBreadcrumbs = breadcrumbs.slice(0, -1);
    otherBreadcrumbs
      .filter(({ url }) => !!url)
      .map(({ url }) => url as string)
      .filter((url) => !url.startsWith('/search/'))
      .forEach((url) => {
        throw Error(
          `[COLLECTIONS VALIDATOR]: Nav Config Breadcrumbs needs to start with /search/, missing in: ${url}, for: ${id}`
        );
      });
  });

  // eslint-disable-next-line no-restricted-syntax
  console.info('[COLLECTIONS VALIDATOR]: Breadcrumbs are valid.');
};

export const _validateFiltersConsistency = (
  searchMetadata: ICollectionSearchMetadata[],
  filters: IFiltersConfig[],
  adapters: IAdapter[]
): void => {
  searchMetadata.forEach(({ id: metadataId }) => {
    const collectionFilters = filters.find(
      ({ id: filterId }) => filterId === metadataId
    ) as IFiltersConfig;
    const filtersNames = collectionFilters.filters.map(({ filter }) => filter);

    const adapter = adapters.find(
      ({ id: adapterId }) => metadataId === adapterId
    ) as IAdapter;
    const adapterFilters = [
      ...adapter.adapter({ id: '', type: '' }).tags.map(({ filter }) => filter),
      ...(adapter.adapter({ id: '', type: '' }).coloredTags || []).map(
        ({ filter }) => filter
      ),
      ...(adapter.adapter({ id: '', type: '' }).secondaryTags || [])
        .map(({ filter }) => filter)
        .filter((filter) => !!filter),
    ];

    const missingFilters = differenceWith(
      adapterFilters,
      filtersNames,
      isEqual
    );
    if (missingFilters.length > 0) {
      throw Error(
        `[COLLECTIONS VALIDATOR]: Missing adapter tags filters configurations: ${missingFilters}, for: ${metadataId}`
      );
    }
  });

  // eslint-disable-next-line no-restricted-syntax
  console.info(
    '[COLLECTIONS VALIDATOR]: Facets and filters have the same fields. Adapter tags filters have its configurations.'
  );
};
