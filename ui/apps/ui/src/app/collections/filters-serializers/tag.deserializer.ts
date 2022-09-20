import { FilterDeserializer } from '@collections/filters-serializers/filter-serializer.interface';
import { sanitizeValue, toArray } from '@collections/filters-serializers/utils';

export class TagDeserializer extends FilterDeserializer<
  string[],
  string | string[]
> {
  override deserialize(): string[] | undefined {
    if (!this._filter) {
      throw Error(`Tag deserializer: filters or values aren't set.`);
    }

    if (!this._value || this._value.length === 0) {
      return undefined;
    }

    return toArray(this._value).map(
      (value) => `${this._filter}:"${sanitizeValue(value)}"`
    );
  }
}
