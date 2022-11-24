import { IFilterConfig } from '@collections/repositories/types';
import { IActiveFilter } from './type';
import { toArray } from '@collections/filters-serializers/utils';
import { truncate } from 'lodash-es';
import { IFqMap } from '@collections/services/custom-route.type';
import { TREE_SPLIT_CHAR } from '@components/filters/utils';

export const mutateUiValue = (config: IFilterConfig, value: string) => {
  if (!config.onFacetsFetch) {
    return value;
  }

  const transformed = config.onFacetsFetch([{ val: value, count: 0 }])[0];
  if (!transformed.name) {
    return value;
  }

  return transformed.name;
};

export const toActiveFilters = (
  fqsMap: IFqMap,
  filtersConfigs: IFilterConfig[]
): IActiveFilter[] => {
  const activeFilters: IActiveFilter[] = [];
  for (const [filter, filterValues] of Object.entries(fqsMap)) {
    const filterConfig = filtersConfigs.find(
      ({ filter: configFilter }) => configFilter === filter
    ) as IFilterConfig;
    for (const value of toArray(filterValues)) {
      const truncatedName = truncate(
        (value + '').split(TREE_SPLIT_CHAR).pop() ?? '',
        {
          length: 50,
        }
      );
      activeFilters.push({
        filter,
        value,
        uiValue: mutateUiValue(filterConfig, truncatedName),
        label: filterConfig.label,
      });
    }
  }
  return activeFilters;
};
