import { FilterDeserializer } from '@collections/filters-serializers/filter-serializer.interface';
import moment from 'moment';

export const EMPTY_DATE_SIGN = '*';
export const DATE_RANGE_SPLIT_SIGN = 'TO';
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
export const DESERIALIZE_DATES_RANGE = (
  startDate: Date | null,
  endDate: Date | null
): string | undefined => {
  if (!startDate && !endDate) {
    return undefined;
  }

  if (!startDate && endDate) {
    return `${EMPTY_DATE_SIGN} ${DATE_RANGE_SPLIT_SIGN} ${moment(endDate)
      .startOf('day')
      .format(DATE_FORMAT)}`;
  }

  if (startDate && !endDate) {
    return `${moment(startDate)
      .startOf('day')
      .format(DATE_FORMAT)} ${DATE_RANGE_SPLIT_SIGN} ${EMPTY_DATE_SIGN}`;
  }

  return `${moment(startDate)
    .startOf('day')
    .format(DATE_FORMAT)} ${DATE_RANGE_SPLIT_SIGN} ${moment(endDate)
    .startOf('day')
    .format(DATE_FORMAT)}`;
};

function isValidDateTimeOrEmptySign(value: string): boolean {
  const regex = /\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[0-1])T\d{2}:\d{2}:\d{2}Z|\*/;
  return regex.test(value);
}

export type dateRangeType =
  | [Date, Date]
  | [Date, null]
  | [null, Date]
  | [null, null]
  | string;
export class DateDeserializer extends FilterDeserializer<
  string,
  dateRangeType
> {
  override deserialize(): string | undefined {
    if (!this._filter) {
      throw Error(`Tag deserializer: filters or values aren't set.`);
    }

    let deserialized: string | undefined;

    if (typeof this._value === 'string') {
      const [startStr, endStr] = this._value.split(
        ` ${DATE_RANGE_SPLIT_SIGN} `
      );
      if (
        !isValidDateTimeOrEmptySign(startStr) ||
        !isValidDateTimeOrEmptySign(endStr)
      ) {
        return undefined;
      }

      const startFormatted = startStr === '*' ? null : new Date(startStr);
      const endFormatted = endStr === '*' ? null : new Date(endStr);
      deserialized = DESERIALIZE_DATES_RANGE(startFormatted, endFormatted);
    } else {
      const [startDate, endDate] = this._value || [];
      if (!startDate && !endDate) {
        return undefined;
      }
      deserialized = DESERIALIZE_DATES_RANGE(startDate, endDate);
    }

    return `${this._filter}:[${deserialized}]`;
  }
}
