import { filterValueType } from '@collections/services/custom-route.type';

export abstract class FilterSerializer<T extends filterValueType> {
  readonly filter: string;
  readonly value: T | undefined;

  protected constructor(fq: string) {
    const filter = ((fq.match(/^[a-zA-Z_]*:/g) as RegExpMatchArray) || [])[0];
    if (!filter) {
      throw Error(
        "Unexpected filters parsing error. Fitler name couldn't be found."
      );
    }

    const values = fq.replace(filter, '');

    this.filter = filter.replace(':', '');
    this.value = this._parseValues(values);
  }

  abstract _parseValues(values: string): T | undefined;
}

export abstract class FilterDeserializer<T extends filterValueType, P> {
  _filter: string | null = null;
  _value: P | null = null;

  filter(filter: string): FilterDeserializer<T, P> {
    this._filter = filter;
    return this;
  }
  values(values: P): FilterDeserializer<T, P> {
    this._value = values;
    return this;
  }
  abstract deserialize(): T | undefined;
}
