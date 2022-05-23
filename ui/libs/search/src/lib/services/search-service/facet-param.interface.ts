/* eslint-disable @typescript-eslint/no-explicit-any  */
import * as PUBLICATIONS_FACETS_NAMES from './publications-facets.json';
import * as SERVICES_FACETS_NAMES from './services-facets.json';

export interface IFacetParam {
  type: 'terms';
  [facet: string]: string;
}

const _toFacet = (field: string) => ({ [field]: { type: 'terms', field } });

export const PUBLICATIONS_FACETS: { [facetName: string]: IFacetParam } = {};
Object.assign(
  PUBLICATIONS_FACETS,
  ...(PUBLICATIONS_FACETS_NAMES as any).default.map(_toFacet)
);

export const SERVICES_FACETS: { [facetName: string]: IFacetParam } = {};
Object.assign(
  SERVICES_FACETS,
  ...(SERVICES_FACETS_NAMES as any).default.map(_toFacet)
);
