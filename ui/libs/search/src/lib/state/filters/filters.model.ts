import {TreeNode} from "@eosc-search-service/layout";

export interface IFilter {
  id: string;
  title: string;
  showMore: boolean;
  data: TreeNode[];
}

export interface IFilterEntry {
  title: string;
  count: number;
}
