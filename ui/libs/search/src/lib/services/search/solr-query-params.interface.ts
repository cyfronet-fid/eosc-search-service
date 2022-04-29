
/**
 * Do a search-input against the specified collection.
 *
 * The q, qf, fq, sort params correspond to
 * https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
 * Paging is cursor-based, see
 * https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.
 */
export interface ISolrQueryParams {
  q: string | '*';
  collection: string;
  qf: string[];
  fq: string[];
  sort: string[];
  rows: number;
  cursor: string | '*';
}

export class SolrQueryParams implements ISolrQueryParams {
  q = '*';
  collection: string;
  qf = [];
  fq = [];
  sort = [];
  rows = 10;
  cursor = '*';

  constructor(params: Partial<ISolrQueryParams> & {collection: string}) {
    this.collection = params.collection;
    Object.assign(this, params);
  }

  toJson(): {
    [param: string]:
      | string
      | number
      | boolean
      | ReadonlyArray<string | number | boolean>;
  } {
    if (this.q && this.q.trim() === '') {
      throw new SolrQueryParamsError('The q param needs to be set');
    }

    if (this.q && this.q.trim() !== '*' && this.qf.length === 0) {
      throw new SolrQueryParamsError(
        'The qf param needs to be set to fetch a data for non-wildcard queries'
      );
    }

    /* eslint-disable @typescript-eslint/no-explicit-any  */
    return { ...(this as any) };
  }
}

export class SolrQueryParamsError extends Error {
  constructor(msg: string) {
    super(`Solr query params error: ${msg}`);
  }
}
