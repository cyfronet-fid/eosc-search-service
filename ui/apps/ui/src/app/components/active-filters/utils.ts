import { IFilterConfig } from '@collections/repositories/types';
import { IActiveFilter } from './type';

export const toActiveFilters = (
  fqsMap: { [filter: string]: string[] },
  filtersConfigs: IFilterConfig[]
): IActiveFilter[] => {
  const activeFilters: IActiveFilter[] = [];
  for (const [filter, filterValues] of Object.entries(fqsMap)) {
    const filterConfig = filtersConfigs.find(
      ({ filter: configFilter }) => configFilter === filter
    ) as IFilterConfig;
    for (const value of filterValues) {
      activeFilters.push({
        filter,
        value,
        label: filterConfig.label,
      });
    }
  }
  return activeFilters;
};
