import { FilterSerializer } from '@collections/filters-serializers/filter-serializer.interface';
import {
  EMPTY_RANGE_SIGN,
  RANGE_SPLIT_SIGN,
} from '@collections/filters-serializers/range.deserializer';
import moment from 'moment';

export const toRangeTimeFormat = (seconds: number) => {
  const duration = moment.duration(seconds * 1000);
  const hours = Math.floor(duration.asHours());
  const hh = hours < 10 ? `0${hours}` : `${hours}`;
  const mmSs = moment.utc((seconds - hours * 3600) * 1000).format('mm:ss');
  return `${hh}:${mmSs}`;
};

export class RangeSerializer extends FilterSerializer<string> {
  constructor(fq: string) {
    super(fq);
  }

  override _parseValues(values: string): string | undefined {
    if (!values || values.length === 0) {
      return undefined;
    }

    const range = values.match(
      new RegExp(`(\\*|\\d*) ${RANGE_SPLIT_SIGN} (\\*|\\d*)`, 'g')
    );
    if (!range) {
      return undefined;
    }

    const [start, end] = range[0].split(` ${RANGE_SPLIT_SIGN} `);
    if (start === EMPTY_RANGE_SIGN && end === EMPTY_RANGE_SIGN) {
      return undefined;
    }

    if (end === EMPTY_RANGE_SIGN) {
      return `${toRangeTimeFormat(
        +start
      )} ${RANGE_SPLIT_SIGN} ${EMPTY_RANGE_SIGN}`;
    }

    if (start === EMPTY_RANGE_SIGN) {
      return `00:00:00 ${RANGE_SPLIT_SIGN} ${toRangeTimeFormat(+end)}`;
    }

    return `${toRangeTimeFormat(
      +start
    )} ${RANGE_SPLIT_SIGN} ${toRangeTimeFormat(+end)}`;
  }
}
