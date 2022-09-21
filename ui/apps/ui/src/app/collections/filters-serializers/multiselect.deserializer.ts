import { FilterDeserializer } from '@collections/filters-serializers/filter-serializer.interface';
import { sanitizeValue, toArray } from '@collections/filters-serializers/utils';

export class MultiselectDeserializer extends FilterDeserializer<
  string,
  string[]
> {
  override deserialize(): string | undefined {
    if (!this._filter) {
      throw Error(`Multiselect deserializer: filters or values aren't set.`);
    }

    if (!this._value || this._value.length === 0) {
      return undefined;
    }

    return `${this._filter}:(${toArray(this._value)
      .map((value) => `"${sanitizeValue(value)}"`)
      .join(' OR ')})`;
  }
}
