export interface IFacetBucket {
  val: string | number;
  count: number;
}

export interface IFacetResponse {
  buckets: IFacetBucket[];
}

export interface FilterTreeNode {
  id: string; // filter:value
  name: string;
  value: string;
  filter: string;
  count: string;
  disabled?: boolean;
  children?: FilterTreeNode[];
  isSelected: boolean;
  level: number;
  expandable: boolean;
}
