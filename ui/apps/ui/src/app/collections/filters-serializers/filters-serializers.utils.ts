import { IFilterConfig } from '@collections/repositories/types';
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
    if (!serializedFq.value) {
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

  switch (filterConfig.type) {
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
    case 'date':
      return new DateDeserializer()
        .filter(filter)
        .values(values as dateRangeType)
        .deserialize();
    case 'multiselect':
      return new MultiselectDeserializer()
        .filter(filter)
        .values(values as string[])
        .deserialize();
    default:
      throw Error(
        `Filter deserializer isn't defined for: ${filterConfig.type}!`
      );
  }
};

export const serialize = (
  fq: string,
  config: IFilterConfig[] | IFilterConfig
): FilterSerializer<string | string[]> => {
  let filterConfig: IFilterConfig[] | IFilterConfig = config as IFilterConfig;
  if (isArray(config)) {
    const filter = fq.split(':')[0];
    filterConfig = config.find(({ id }) => id === filter) as IFilterConfig;
  }

  switch (filterConfig.type) {
    case 'tag':
      return new TagSerializer(fq);
    case 'select':
    case 'range':
      return new RangeSerializer(fq);
    case 'date':
      return new DateSerializer(fq);
    case 'multiselect':
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
