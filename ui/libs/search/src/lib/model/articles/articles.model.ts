import {IFacetResponse} from "../../services";

export interface IArticle {
  id: string;
  title: string;
  author_names: string[];
  description: string[];
  rating?: number;
}

export interface ISearchResults<T> {
  results: T[];
  facets: { [facetName: string]: IFacetResponse };
  nextCursorMark: string;
  numFound: number;
}
