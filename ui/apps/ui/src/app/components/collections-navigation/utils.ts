import { ICollectionNavConfig } from '../../collections/repositories/types';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';

export const toNavigationLink = (nav: ICollectionNavConfig) => ({
  label: nav.title,
  routerLink: `/${SEARCH_PAGE_PATH}/${nav.urlParam}`,
});
