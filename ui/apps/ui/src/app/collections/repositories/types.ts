export interface IValueWithLabel {
  label: string;
  value: string;
}

export interface IResult {
  id: string;
  title: string;
  description: string;
  type: IValueWithLabel;
  collection: string;
  url: string;
  tags: ITag[];

  date?: string;
  coloredTags?: IColoredTag[];
  usageCountsViews: number | null;
  usageCountsDownloads: number | null;
}

export interface ITag {
  label: string;
  values: IValueWithLabel[];
  filter: string;
}

export interface IColoredTag {
  colorClassName: string;
  values: IValueWithLabel[];
  filter: string;
}

export interface ISolrCollectionParams {
  qf: string[];
  collection: string;
}

export interface ISolrQueryParams {
  q: string;
  fq: string[];
  sort: string[];
  cursor: string;
}

export interface ISearchResults<T extends { id: string }> {
  results: T[];
  facets: { [field: string]: IFacetResponse };
  nextCursorMark: string;
  numFound: number;
}

export interface IFacetParam {
  type: 'terms';
  offset?: number;
  limit?: number;
  sort?: number;
  prefix?: string;
  contains?: string;

  [facet: string]: string | number | undefined;
}

export interface ICollectionNavConfig {
  id: string;
  title: string;
  urlParam: string;

  breadcrumbs: {
    label: string;
    url?: string;
  }[];
}
export interface IAdapter {
  id: string;
  adapter: adapterType;
}
export type adapterType = <T>(item: Partial<T> & { id: string }) => IResult;
export interface IFiltersConfig {
  id: string;
  filters: IFilterConfig[];
}
export interface IFilterConfig {
  id: string;
  filter: string;
  label: string;
  type: 'multiselect' | 'select' | 'date' | 'tag' | 'range';

  onFacetsFetch?: (bucketValues: IFacetBucket[]) => IFilterNode[]; // !!! only for multiselect !!!
}

export interface ICollectionSearchMetadata {
  id: string;
  facets: { [field: string]: IFacetParam };
  params: ISolrCollectionParams;
}

export interface ISolrQueryParams {
  q: string;
  fq: string[];
  sort: string[];
  rows: number;
  cursor: string;
}

export interface IFacetBucket {
  val: string | number;
  count: number;
}

export interface IFacetResponse {
  buckets: IFacetBucket[];
}

export interface IUIFilterTreeNode extends IFilterNode {
  children?: IUIFilterTreeNode[];
}

export interface IFilterNode {
  id: string; // value
  name: string;
  value: string;
  filter: string;
  count: string;
  isSelected: boolean;
  level: number;
  expandable?: boolean; // calculated based on children
  parent?: string;
  disabled?: boolean;
}
