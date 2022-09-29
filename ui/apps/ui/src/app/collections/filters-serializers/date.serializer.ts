import { FilterSerializer } from '@collections/filters-serializers/filter-serializer.interface';

export class DateSerializer extends FilterSerializer<string> {
  constructor(fq: string) {
    super(fq);
  }

  override _parseValues(values: string): string | undefined {
    if (!values || values.length === 0) {
      return undefined;
    }

    const dates = values.match(
      /(\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[0-1])T\d{2}:\d{2}:\d{2}Z|\*) TO (\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[0-1])T\d{2}:\d{2}:\d{2}Z|\*)/g
    );
    if (!dates) {
      return undefined;
    }

    return dates[0];
  }
}
