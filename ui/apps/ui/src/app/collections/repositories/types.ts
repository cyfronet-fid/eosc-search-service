export interface IValueWithLabel {
  label: string;
  value: string;
  subTitle?: string;
}

export interface IResult {
  id: string;
  title: string;
  abbreviation?: string;
  description: string | string[];
  type: IValueWithLabel;
  collection: string;
  url: string;
  tags: ITag[];
  date?: string;
  coloredTags?: IColoredTag[];
  secondaryTags?: ISecondaryTag[];
  accessRight?: string;
  license?: string | string[];
  languages?: string[];
  views?: number;
  downloads?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offers?: any[];
  isSortByRelevanceCollectionScopeOff?: boolean;
  isSortCollectionScopeOff?: boolean;
}

export interface ISecondaryTag {
  iconPath: string;
  values: IValueWithLabel[];
  filter?: string;
  type: 'url' | 'info';
}

export interface IValueWithLabelAndLink extends IValueWithLabel {
  externalLink?: { broken: boolean; link?: string };
}

export interface ITag {
  label: string;
  values: IValueWithLabelAndLink[];
  filter: string;
}

export interface IColoredTag {
  colorClassName: string;
  values: IValueWithLabel[];
  filter: string;
}

export interface ISolrCollectionParams {
  qf: string;
  collection: string;
}

export interface ISolrQueryParams {
  q: string;
  fq: string[];
  sort: string[];
  cursor: string;
}

export interface ISolrSuggestionQueryParams {
  q: string;
  fq: string[];
}

export interface ISearchResults<T extends { id: string }> {
  results: T[];
  facets: { [field: string]: ITermsFacetResponse | IStatFacetResponse };
  nextCursorMark: string;
  numFound: number;
  highlighting: {
    [id: string]: { [field: string]: string[] | undefined } | undefined;
  };
}

export interface ITermsFacetParam {
  type: 'terms';
  offset?: number;
  limit?: number;
  sort?: number;
  prefix?: string;
  contains?: string;

  [facet: string]: string | number | undefined;
}

export interface IStatFacetParam {
  expression: string;
}

export interface ICollectionNavConfig {
  id: string;
  title: string;
  urlParam: string;
  rightMenu: boolean;

  breadcrumbs: {
    label: string;
    url?: string;
  }[];
}

export interface ICollectionTagsConfig {
  name: string;
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
  type:
    | 'multiselect'
    | 'select'
    | 'date-year'
    | 'date-calendar'
    | 'tag'
    | 'range';
  defaultCollapsed: boolean;
  tooltipText: string;

  onFacetsFetch?: (bucketValues: IFacetBucket[]) => IFilterNode[]; // !!! only for multiselect !!!
  customSort?: (a: IFilterNode, b: IFilterNode) => number;
}
export interface IExcludedFiltersConfig {
  id: string;
  excluded: string[];
}

export interface ICollectionSearchMetadata {
  id: string;
  facets: { [field: string]: ITermsFacetParam };
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

export interface ITermsFacetResponse {
  buckets: IFacetBucket[];
}

export type IStatFacetResponse = number;

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

export interface IInteroperabilityRecord {
  id: string;
  resourceId: string;
  catalogueId: string;
  interoperabilityRecordIds: string;
}

export interface ICreator {
  authorName: string;
  authorType: string;
  authorNameId: string;
  authorAffiliations: string;
  authorAffiliationsId: string;
}
