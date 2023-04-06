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

function isValidTimeOrEmptyRange(input: string): boolean {
  const regex = /^((0[0-9]|[1-9][0-9]):([0-5]?\d):([0-5]?\d)|\*)$/;
  return regex.test(input);
}

function toSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export class RangeDeserializer extends FilterDeserializer<
  string,
  [number, number] | string
> {
  override deserialize(): string | undefined {
    if (!this._filter) {
      throw new Error(`Tag deserializer: filters or values aren't set.`);
    }

    let deserializedRange: string | undefined;

    if (typeof this._value === 'string') {
      const [startStr, endStr] = this._value.split(` ${RANGE_SPLIT_SIGN} `);
      if (
        !isValidTimeOrEmptyRange(startStr) ||
        !isValidTimeOrEmptyRange(endStr)
      ) {
        return undefined;
      }
      const startFormatted = startStr === '*' ? null : toSeconds(startStr);
      const endFormatted = endStr === '*' ? null : toSeconds(endStr);
      deserializedRange = DESERIALIZE_RANGE(startFormatted, endFormatted);
    } else {
      const [start, end] = this._value || [];
      deserializedRange = DESERIALIZE_RANGE(start, end);
    }

    if (!deserializedRange) {
      return undefined;
    }

    return `${this._filter}:[${deserializedRange}]`;
  }
}
