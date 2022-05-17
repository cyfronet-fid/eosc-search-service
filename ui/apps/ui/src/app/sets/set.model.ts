import { CollectionSearchMetadata } from '../collections/collection.model';

interface IBreadcrumb {
  label: string;
  url?: string;
}

export interface ISet {
  title: string;
  breadcrumbs: IBreadcrumb[];
  urlPath: string;
  collections: CollectionSearchMetadata<any>[];
}
