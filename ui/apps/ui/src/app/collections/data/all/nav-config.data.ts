import { ICollectionNavConfig } from '../../repositories/types';

export const URL_PARAM_NAME = 'all';
export const LABEL = 'Katalog';
export const allCollectionsNavConfig: ICollectionNavConfig = {
  id: URL_PARAM_NAME,
  title: LABEL,
  breadcrumbs: [
    {
      label: LABEL,
    },
  ],
  urlParam: URL_PARAM_NAME,
};
