import { FilterDeserializer } from '@collections/filters-serializers/filter-serializer.interface';

export const EMPTY_DATE_SIGN = '*';
export const DATE_RANGE_SPLIT_SIGN = 'TO';

export const DESERIALIZE_YEAR_RANGE = (
  startDate: number | null,
  endDate: number | null
): string | undefined => {
  if (!startDate && !endDate) {
    return undefined;
  }

  if (!startDate && endDate) {
    return `${EMPTY_DATE_SIGN} ${DATE_RANGE_SPLIT_SIGN} ${endDate}`;
  }

  if (startDate && !endDate) {
    return `${startDate} ${DATE_RANGE_SPLIT_SIGN} ${EMPTY_DATE_SIGN}`;
  }

  return `${startDate} ${DATE_RANGE_SPLIT_SIGN} ${endDate}`;
};

function isValidYearOrEmptySign(value: string): boolean {
  const regex = /(\d{4}|\*)/g;
  return regex.test(value);
}
//
export type dateRangeType =
  | [number, number]
  | [number, null]
  | [null, number]
  | [null, null]
  | string;
export class DateRangeDeserializer extends FilterDeserializer<
  string,
  dateRangeType
> {
  override deserialize(): string | undefined {
    if (!this._filter) {
      throw Error(`Date range deserializer: filters or values aren't set.`);
    }

    let deserialized: string | undefined;

    if (typeof this._value === 'string') {
      const [startStr, endStr] = this._value.split(
        ` ${DATE_RANGE_SPLIT_SIGN} `
      );
      if (
        !isValidYearOrEmptySign(startStr) ||
        !isValidYearOrEmptySign(endStr)
      ) {
        return undefined;
      }
      deserialized = DESERIALIZE_YEAR_RANGE(
        parseInt(startStr),
        parseInt(endStr)
      );
    } else {
      const [startDate, endDate] = this._value || [];
      if (!startDate && !endDate) {
        return undefined;
      }
      deserialized = DESERIALIZE_YEAR_RANGE(startDate, endDate);
    }
    return `${this._filter}:[${deserialized}]`;
  }
}
