import {ICollectionSearchMetadata} from "../state/results/results.service";
import {ICategory} from "@eosc-search-service/common";

export interface IBreadcrumb {
  label: string;
  url?: string;
}

export interface ISet {
  title: string;
  breadcrumbs: IBreadcrumb[];
  categories?: ICategory[];
  urlPath: string;
  collections: ICollectionSearchMetadata[];
}
