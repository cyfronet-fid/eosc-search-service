import {ISet} from './set.model';
import {softwareCollection} from "../collections/publications/publications.collection";
import {ALL_CATALOGS_LABEL} from "./all.set";

export const softwareSet: ISet = {
  title: 'Software',
  breadcrumbs: [
    {
      label: ALL_CATALOGS_LABEL,
      url: '/search/all',
    },
    {
      label: 'Software',
    },
  ],
  urlPath: 'software',
  collections: [softwareCollection],
};

