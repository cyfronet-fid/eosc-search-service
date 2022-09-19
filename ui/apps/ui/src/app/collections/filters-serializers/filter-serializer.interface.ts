export abstract class FilterSerializer<T extends string[] | string> {
  readonly filter: string;
  readonly value: T;

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
