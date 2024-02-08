import {
  IFilterConfig,
  IFilterNode,
  IUIFilterTreeNode,
} from '@collections/repositories/types';
import { MultiselectSerializer } from '@collections/filters-serializers/multiselect.serializer';
import { FilterSerializer } from '@collections/filters-serializers/filter-serializer.interface';
import { isArray } from 'lodash-es';
import { MultiselectDeserializer } from '@collections/filters-serializers/multiselect.deserializer';
import { TagSerializer } from '@collections/filters-serializers/tag.serializer';
import { toArray } from '@collections/filters-serializers/utils';
import { TagDeserializer } from '@collections/filters-serializers/tag.deserializer';
import {
  IFqMap,
  filterValueType,
} from '@collections/services/custom-route.type';
import { DateSerializer } from '@collections/filters-serializers/date.serializer';
import { RangeSerializer } from '@collections/filters-serializers/range.serializer';
import {
  DateDeserializer,
  dateRangeType,
} from '@collections/filters-serializers/date.deserializer';
import { RangeDeserializer } from '@collections/filters-serializers/range.deserializer';
import { DateRangeDeserializer } from './year-range.deserializer';
import { DateRangeSerializer } from './year-range.serializer';

export const serializeAll = (
  fqs: string[],
  filtersConfigs: IFilterConfig[]
): IFqMap => {
  if (fqs.length === 0) {
    return {};
  }

  const fqMap: { [filter: string]: string | string[] } = {};
  for (const fq of fqs) {
    const serializedFq = serialize(fq, filtersConfigs);
    if (!serializedFq || !serializedFq.value) {
      continue;
    }

    if (!fqMap[serializedFq.filter]) {
      fqMap[serializedFq.filter] = serializedFq.value;
      continue;
    }

    if (isArray(fqMap[serializedFq.filter])) {
      fqMap[serializedFq.filter] = [
        ...fqMap[serializedFq.filter],
        ...toArray(serializedFq.value),
      ];
      continue;
    }

    fqMap[serializedFq.filter] = [
      fqMap[serializedFq.filter] as string,
      serializedFq.value as string,
    ];
  }

  return fqMap;
};

export const deserializeAll = (
  fqsMap: IFqMap,
  filtersConfigs: IFilterConfig[]
): string[] => {
  if (Object.keys(fqsMap).length === 0) {
    return [];
  }
  const fqs: string[] = [];
  for (const [filter, values] of Object.entries(fqsMap)) {
    const deserializedFilter = deserialize(filter, values, filtersConfigs);
    if (
      (!isArray(deserializedFilter) && deserializedFilter) ||
      (isArray(deserializedFilter) && deserializedFilter.length > 0)
    ) {
      fqs.push(...toArray(deserializedFilter));
    }
  }
  return fqs;
};

export const deserialize = (
  filter: string,
  values: filterValueType,
  config: IFilterConfig[] | IFilterConfig
): string | string[] | undefined => {
  let filterConfig: IFilterConfig[] | IFilterConfig = config as IFilterConfig;
  if (isArray(config)) {
    filterConfig = config.find(({ id }) => id === filter) as IFilterConfig;
  }
  if (filterConfig == null) {
    return undefined;
  }

  switch (filterConfig?.type) {
    case 'tag':
      return new TagDeserializer()
        .filter(filter)
        .values(values as string | string[])
        .deserialize();
    case 'select':
    case 'range':
      return new RangeDeserializer()
        .filter(filter)
        .values(values as [number, number] | string)
        .deserialize();
    case 'date-range':
      return new DateRangeDeserializer()
        .filter(filter)
        .values(values as [number, number] | string)
        .deserialize();
    case 'date-year':
    case 'date-start-end':
    case 'date-calendar':
      return new DateDeserializer()
        .filter(filter)
        .values(values as dateRangeType)
        .deserialize();
    case 'multiselect':
      return new MultiselectDeserializer()
        .filter(filter)
        .values(values as string[])
        .deserialize();
    case 'dropdown':
    case 'checkbox-resource-type':
    case 'checkbox-status':
      return new MultiselectDeserializer()
        .filter(filter)
        .values(values as string[])
        .deserialize();
    default:
      throw Error(
        `Filter deserializer isn't defined for: ${filterConfig?.type} (${filter})!`
      );
  }
};

export const serialize = (
  fq: string,
  config: IFilterConfig[] | IFilterConfig
): FilterSerializer<string | string[]> | undefined => {
  let filterConfig: IFilterConfig[] | IFilterConfig = config as IFilterConfig;
  if (isArray(config)) {
    const filter = fq.split(':')[0];
    filterConfig = config.find(({ id }) => id === filter) as IFilterConfig;
  }

  if (!filterConfig) {
    return;
  }

  switch (filterConfig.type) {
    case 'tag':
      return new TagSerializer(fq);
    case 'select':
    case 'range':
      return new RangeSerializer(fq);
    case 'date-range':
      return new DateRangeSerializer(fq);
    case 'date-year':
    case 'date-start-end':
    case 'date-calendar':
      return new DateSerializer(fq);
    case 'multiselect':
      return new MultiselectSerializer(fq);
    case 'dropdown':
    case 'checkbox-resource-type':
    case 'checkbox-status':
      return new MultiselectSerializer(fq);
    default:
      throw Error(`Filter serializer isn't defined for: ${filterConfig.type}!`);
  }
};

export const removeFilterValue = (
  fqMap: IFqMap,
  filter: string,
  value: string,
  filtersConfigs: IFilterConfig[]
): string[] => {
  fqMap[filter] = toArray(fqMap[filter]).filter(
    (currentValue) => currentValue !== value
  );
  return deserializeAll(fqMap, filtersConfigs);
};

export const removeFilterValueTree = (
  fqMap: IFqMap,
  filtersToRemove: [IUIFilterTreeNode, boolean][],
  filtersConfigs: IFilterConfig[],
  allSelected: IFilterNode[]
): string[] => {
  for (const toRemove of filtersToRemove) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ filter, value }, _] = toRemove;
    const oldValues = toArray(fqMap[filter]).filter(
      (currentValue) => currentValue !== value
    );

    if (value.includes('>')) {
      if (oldValues.some((element) => element.includes('>'))) {
        if (
          oldValues.filter((element) => element.includes(value.split('>')[0]))
            .length == 1
        ) {
          fqMap[filter] = toArray(fqMap[filter]).filter(
            (currentValue) => currentValue !== value.split('>')[0]
          );
        } else {
          // More than one hidden elem
          // compare oldValues
          fqMap[filter] = oldValues;
          fqMap[filter] = toArray(fqMap[filter]).filter(
            (currentValue) =>
              allSelected.filter((elem) => elem.id === currentValue).length > 0
          );
          // Double check if that was not the last elem
          const olderOne = toArray(fqMap[filter]);
          if (
            olderOne.filter((element) => element.includes(value.split('>')[0]))
              .length == 1
          ) {
            fqMap[filter] = toArray(fqMap[filter]).filter(
              (currentValue) => currentValue !== value.split('>')[0]
            );
          }
        }
      } else {
        fqMap[filter] = [];
      }
    } else {
      fqMap[filter] = toArray(fqMap[filter]).filter((currentValue) => {
        if (currentValue.includes(value)) {
          return false;
        } else {
          return true;
        }
      });
    }
  }

  const deserialized = deserializeAll(fqMap, filtersConfigs);
  return deserialized;
};

export const addFilterValue = (
  fqMap: IFqMap,
  allFilters: IFilterConfig[],
  filterName: string,
  value: string
): string[] => {
  if (!!fqMap[filterName] && (fqMap[filterName] as string[]).includes(value)) {
    return deserializeAll(fqMap, allFilters);
  }

  fqMap[filterName] = fqMap[filterName]
    ? ([...fqMap[filterName], value] as string[])
    : [value];
  return deserializeAll(fqMap, allFilters);
};
