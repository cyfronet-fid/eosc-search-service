import { ICollectionNavConfig } from '../../collections/repositories/types';
import {SEARCH_PAGE_PATH} from "../../pages/search-page/custom-router.type";

export const toNavigationLink = (nav: ICollectionNavConfig) => ({
  label: nav.title,
  routerLink: `/${SEARCH_PAGE_PATH}/${nav.urlPath}`,
});
