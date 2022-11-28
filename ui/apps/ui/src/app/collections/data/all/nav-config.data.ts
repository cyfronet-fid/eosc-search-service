import { ICollectionNavConfig } from '../../repositories/types';

export const URL_PARAM_NAME = 'all';
export const LABEL = 'All catalogs';
export const allCollectionsNavConfig: ICollectionNavConfig = {
  id: URL_PARAM_NAME,
  title: LABEL,
  resourceType: null,
  breadcrumbs: [
    {
      label: LABEL,
    },
  ],
  urlParam: URL_PARAM_NAME,
};
