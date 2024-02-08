import { FilterSerializer } from '@collections/filters-serializers/filter-serializer.interface';

export class DateRangeSerializer extends FilterSerializer<string> {
  constructor(fq: string) {
    super(fq);
  }

  override _parseValues(values: string): string | undefined {
    if (!values || values.length === 0) {
      return undefined;
    }

    const dates = values.match(/(\d{4}|\*) TO (\d{4}|\*)/g);
    if (!dates) {
      return undefined;
    }

    return dates[0];
  }
}
