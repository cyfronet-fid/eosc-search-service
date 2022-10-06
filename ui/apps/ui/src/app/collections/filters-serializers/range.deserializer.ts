import { FilterDeserializer } from '@collections/filters-serializers/filter-serializer.interface';
import { isNumber } from 'lodash-es';

export const EMPTY_RANGE_SIGN = '*';
export const RANGE_SPLIT_SIGN = 'TO';
export const DESERIALIZE_RANGE = (
  start: number | null | undefined,
  end: number | null | undefined
): string | undefined => {
  if (!isNumber(start) && !isNumber(end)) {
    return undefined;
  }

  if (!isNumber(start) && isNumber(end)) {
    return `${EMPTY_RANGE_SIGN} ${RANGE_SPLIT_SIGN} ${end}`;
  }

  if (isNumber(start) && !isNumber(end as number)) {
    return `${start} ${RANGE_SPLIT_SIGN} ${EMPTY_RANGE_SIGN}`;
  }

  return `${start} ${RANGE_SPLIT_SIGN} ${end}`;
};
export class RangeDeserializer extends FilterDeserializer<
  string,
  [number, number]
> {
  override deserialize(): string | undefined {
    if (!this._filter) {
      throw Error(`Tag deserializer: filters or values aren't set.`);
    }

    const [start, end] = this._value || [];
    const deserializedRange = DESERIALIZE_RANGE(start, end);
    if (!deserializedRange) {
      return undefined;
    }

    return `${this._filter}:[${deserializedRange}]`;
  }
}
