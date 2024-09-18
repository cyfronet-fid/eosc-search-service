import { entitiesPropsFactory } from '@ngneat/elf-entities';
import { InstanceExportData } from '@collections/data/openair.model';

export interface IValueWithLabel {
  label: string;
  value: string;
  subTitle?: string;
}

export interface IArticle {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface IResult {
  id: string;
  title: string;
  abbreviation?: string;
  description: string | string[];
  documentType?: string[];
  type: IValueWithLabel;
  collection: string;
  urls?: string[];
  redirectUrl: string;
  logoUrl?: string;
  tags: ITag[];
  date?: string;
  coloredTags?: IColoredTag[];
  secondaryTags?: ISecondaryTag[];
  accessRight?: AccessRight;
  license?: string | string[];
  languages?: string[];
  views?: number;
  downloads?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offers?: any[];
  isResearchProduct: boolean;
  horizontal?: boolean;
  pids?: Pids;
  providerName?: string[];
  orderUrl?: string;
  exportData?: InstanceExportData[];
  relatedServices?: RelatedService[];
  country?: string;
  website?: string;
  currency?: string;
  cost?: number;
  code?: string;
  fundedUnder?: string;
  startDate?: string;
  endDate?: string;
  partners?: string[];
  dateRange?: string;
  yearRange?: string;
  relatedOrganisations?: string[];
  relatedPublicationNumber?: number;
  relatedDatasetNumber?: number;
  relatedOtherNumber?: number;
  relatedProjectNumber?: number;
  relatedSoftwareNumber?: number;
  relatedOrganisationTitles?: string[];
  pid?: string;
  funder?: string[];
}

export interface RelatedService {
  pid: string;
  best_access_right: AccessRight;
  title: string;
  resource_organisation: string;
  tagline: string;
  joined_categories: string[];
  type: string;
  logoUrl: string;
}

export interface ISecondaryTag {
  iconPath?: string;
  label?: string;
  values: IValueWithLabel[];
  filter?: string;
  type: 'url' | 'info';
}

export interface IValueWithLabelAndLink extends IValueWithLabel {
  externalLink?: { link?: string };
}

export interface ITag {
  label: string;
  values: IValueWithLabelAndLink[];
  filter: string;
  showMoreThreshold?: number;
}

export interface IColoredTag {
  colorClassName: string;
  values: IValueWithLabel[];
  filter: string;
}

export interface ISolrCollectionParams {
  qf: string;
  collection: string;
  scope?: string;
}

export interface ISolrSuggestionQueryParams {
  q: string;
  fq: string[];
}

export interface ISearchResults<T extends { id: string }> {
  results: T[];
  facets: { [field: string]: ITermsFacetResponse | IStatFacetResponse };
  nextCursorMark: string;
  isError?: boolean;
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
  isSortByRelevanceCollectionScopeOff?: boolean;
  isSortByPopularityCollectionScopeOff?: boolean;

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

export interface FiltersStoreConfig {
  loading: boolean;
}
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
    | 'date-range'
    | 'date-start-end'
    | 'date-calendar'
    | 'tag'
    | 'range'
    | 'dropdown'
    | 'checkbox-resource-type'
    | 'checkbox-status';
  defaultCollapsed: boolean;
  tooltipText: string;
  expandArrow?: boolean;

  customSort?: (a: IFilterNode, b: IFilterNode) => number;
  transformNodes?: (nodes: IFilterNode[]) => IFilterNode[];
  global?: boolean;
}

export const { filterUIEntitiesRef, withFilterUIEntities } =
  entitiesPropsFactory('filterUI');

export interface IFilterConfigUI {
  id: string;
  options: IFilterNode[];
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
  exact: string;
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
  isSelected: boolean | undefined;
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

export type AccessRight =
  | 'open access'
  | 'restricted'
  | 'embargo'
  | 'closed'
  | 'other'
  | 'order required';

export interface Pids {
  doi: string[];
  handle: string[];
  pmc: string[];
  pmid: string[];
}
