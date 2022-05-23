import {ICollectionSearchMetadata} from "../state/results/results.service";

export interface IBreadcrumb {
  label: string;
  url?: string;
}

export interface ISet {
  title: string;
  breadcrumbs: IBreadcrumb[];
  urlPath: string;
  collections: ICollectionSearchMetadata[];
}
