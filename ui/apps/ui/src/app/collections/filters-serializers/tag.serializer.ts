import { FilterSerializer } from '@collections/filters-serializers/filter-serializer.interface';
import { sanitizationReverse } from '@collections/filters-serializers/utils';

export class TagSerializer extends FilterSerializer<string> {
  constructor(fq: string) {
    super(fq);
  }

  override _parseValues(value: string): string {
    return sanitizationReverse(value.replace(/^"|"$/g, ''));
  }
}
