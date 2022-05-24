import {IFacetParam} from "../services/search-service/facet-param.interface";
import * as hash from "object-hash";
import {SolrQueryParams} from "../services/search";

export const calcHash = (
  params: SolrQueryParams,
  facets: { [facet: string]: IFacetParam }
): string => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cursor, ...rest } = params.toJson();
  return hash({ ...rest, ...facets });
};
