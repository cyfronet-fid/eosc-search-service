import { ICollectionNavConfig } from '../../repositories/types';

export const URL_PARAM_NAME = 'all_collection';
export const LABEL = 'All Resources';
export const allCollectionsNavConfig: ICollectionNavConfig = {
  id: URL_PARAM_NAME,
  title: LABEL,
  breadcrumbs: [
    {
      label: LABEL,
    },
  ],
  urlParam: URL_PARAM_NAME,
  rightMenu: false,
  isSortByRelevanceCollectionScopeOff: true,
  isSortByPopularityCollectionScopeOff: false,
};
