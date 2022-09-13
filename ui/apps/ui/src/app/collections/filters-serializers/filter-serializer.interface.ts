export abstract class FilterSerializer<T extends string[] | string> {
  readonly filter: string;
  readonly value: T;

  protected constructor(fq: string) {
    const [filter, values] = fq.trim().split(':');
    this.filter = filter;
    this.value = this._parseValues(values);
  }

  abstract _parseValues(values: string): T;
}

export abstract class FilterDeserializer<T extends string[] | string> {
  _filter: string | null = null;
  _value: T | null = null;

  filter(filter: string): FilterDeserializer<T> {
    this._filter = filter;
    return this;
  }
  values(values: T): FilterDeserializer<T> {
    this._value = values;
    return this;
  }
  abstract deserialize(): string | string[] | undefined;
}
