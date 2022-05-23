import { SolrQueryParams } from './solr-query-params.interface';
import { IFacetParam } from './facet-param.interface';
import * as hash from 'object-hash';

export const calcHash = (
  params: SolrQueryParams,
  facets: { [facet: string]: IFacetParam }
): string => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cursor, ...rest } = params.toJson();
  return hash({ ...rest, ...facets });
};

export const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};
