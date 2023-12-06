import { ICollectionNavConfig } from '../../repositories/types';
import { LABEL as ALL_COLLECTIONS_LABEL } from '../all/nav-config.data';
import { URL_PARAM_NAME as ALL_COLLECTIONS_PARAM_NAME } from '../all/nav-config.data';

export const URL_PARAM_NAME = 'dataset';
export const LABEL = 'Data';
export const datasetsNavConfig: ICollectionNavConfig = {
  id: URL_PARAM_NAME,
  title: LABEL,
  breadcrumbs: [
    {
      label: ALL_COLLECTIONS_LABEL,
      url: `/search/${ALL_COLLECTIONS_PARAM_NAME}`,
    },
    {
      label: LABEL,
    },
  ],
  urlParam: URL_PARAM_NAME,
  rightMenu: false,
  isSortByRelevanceCollectionScopeOff: false,
  isSortByPopularityCollectionScopeOff: false,
};
