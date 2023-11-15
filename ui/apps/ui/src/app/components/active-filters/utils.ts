import { IFilterConfig, IFilterNode } from '@collections/repositories/types';
import { IActiveFilter } from './type';
import { toArray } from '@collections/filters-serializers/utils';
import { truncate } from 'lodash-es';
import { IFqMap } from '@collections/services/custom-route.type';
import { TREE_SPLIT_CHAR } from '@components/filters/utils';
import { interoperabilityGuidelinesTypeDictionary } from '../../dictionary/interoperabilityGuidelinesTypeDictionary';

const valueToTmpFilterNode = (value: string): IFilterNode =>
  // TODO: Remove or refactor
  ({
    id: value,
    name: value,
    value: value,
    count: '0',
    filter: '',
    isSelected: false,
    level: 0,
  } as IFilterNode);

export const mutateUiValue = (config: IFilterConfig, value: string) => {
  if (!config.transformNodes) {
    return value;
  }

  const transformed = config.transformNodes([valueToTmpFilterNode(value)])[0];
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
      const nextValue = interoperabilityGuidelinesTypeDictionary[value]
        ? interoperabilityGuidelinesTypeDictionary[value]
        : value;

      const mutatedName = mutateUiValue(
        filterConfig,
        (nextValue + '').split(TREE_SPLIT_CHAR).pop() ?? ''
      );

      activeFilters.push({
        filter,
        value,
        uiValue: truncate(mutatedName, { length: 50 }),
        label: filterConfig.label,
      });
    }
  }
  return activeFilters;
};
