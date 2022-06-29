import { ISet } from './set.model';
import {dataCollection} from "../collections/publications/publications.collection";
import {ALL_CATALOGS_LABEL} from "./all.set";

export const dataSet: ISet = {
  title: 'Data',
  breadcrumbs: [
    {
      label: ALL_CATALOGS_LABEL,
      url: '/search/all',
    },
    {
      label: 'Data',
      url: '/search/data'
    },
  ],
  urlPath: 'data',
  collections: [dataCollection],
};

