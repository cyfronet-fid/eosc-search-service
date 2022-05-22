/**
 * Do a search-service against the specified collection.
 *
 * The q, qf, fq, sort params correspond to
 * https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
 * Paging is cursor-based, see
 * https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.
 */
export class SolrQueryParams {
  q: string | '*' = '*';
  _qf: string[] = [];
  fq: string[] = [];
  sort: string[] = [];
  rows = 100;
  cursor = '*';
  collection = '';

  get qf() {
    return this.q === '*' ? [] : this._qf;
  }

  set qf(qf: string[]) {
    this._qf = qf;
  }

  constructor(params: Partial<SolrQueryParams> = {}) {
    Object.assign(this, params);
  }

  toJson(): {
    [param: string]:
      | string
      | number
      | boolean
      | ReadonlyArray<string | number | boolean>;
  } {
    if (!this.q || this.q.trim() === '') {
      throw new SolrQueryParamsError('The q param needs to be set.');
    }

    if (!this.collection || this.collection.trim() === '') {
      throw new SolrQueryParamsError('The collection param needs to be set.');
    }

    if (this.q && this.q.trim() !== '*' && this.qf.length === 0) {
      throw new SolrQueryParamsError(
        'The qf param needs to be set to fetch a data for non-wildcard queries.'
      );
    }

    /* eslint-disable @typescript-eslint/no-explicit-any  */
    return {
      q: this.q,
      qf: this.qf,
      fq: this.fq,
      sort: this.sort,
      rows: this.rows,
      cursor: this.cursor,
      collection: this.collection,
    };
  }
}

export class SolrQueryParamsError extends Error {
  constructor(msg: string) {
    super(`Solr query params error: ${msg}`);
  }
}
