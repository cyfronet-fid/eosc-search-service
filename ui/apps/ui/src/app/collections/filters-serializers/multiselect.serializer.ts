import { FilterSerializer } from '@collections/filters-serializers/filter-serializer.interface';
import { sanitizationReverse } from '@collections/filters-serializers/utils';

export class MultiselectSerializer extends FilterSerializer<string[]> {
  constructor(fq: string) {
    super(fq);
  }

  override _parseValues(values: string) {
    if (!values) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return [...values.matchAll(/"[^"]+"/g)].map(([match, ..._]) =>
      sanitizationReverse(match.replace(/"/g, ''))
    );
  }
}
