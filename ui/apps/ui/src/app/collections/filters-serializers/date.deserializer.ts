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
export type dateRangeType =
  | [Date, Date]
  | [Date, null]
  | [null, Date]
  | [null, null];
export class DateDeserializer extends FilterDeserializer<
  string,
  dateRangeType
> {
  override deserialize(): string | undefined {
    if (!this._filter) {
      throw Error(`Tag deserializer: filters or values aren't set.`);
    }

    const [startDate, endDate] = this._value || [];
    if (!startDate && !endDate) {
      return undefined;
    }

    return `${this._filter}:[${DESERIALIZE_DATES_RANGE(startDate, endDate)}]`;
  }
}
