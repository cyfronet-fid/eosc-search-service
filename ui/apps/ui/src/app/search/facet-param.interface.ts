/* eslint-disable @typescript-eslint/no-explicit-any  */
import * as FACETS_NAMES from './facets.json';

export interface IFacetParam {
  type: 'terms';
  [facet: string]: string;
}

export const FACETS: { [facetName: string]: IFacetParam } = {};
const _toFacet = (field: string) => ({ [field]: { type: 'terms', field } });
Object.assign(FACETS, ...(FACETS_NAMES as any).default.map(_toFacet));
