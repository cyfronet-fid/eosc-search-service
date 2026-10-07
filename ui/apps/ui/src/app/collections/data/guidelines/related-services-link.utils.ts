import { URL_PARAM_NAME as SERVICES_URL_PARAM_NAME } from '@collections/data/services/nav-config.data';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';

const escapeSolrValue = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

export const buildRelatedServicesLink = (
  ids: string[],
  guidelineTitle: string
): string | undefined => {
  const pids = [
    ...new Set(ids.filter((id) => id?.trim()).map((id) => id.trim())),
  ];

  if (!pids.length) {
    return undefined;
  }

  const pidFilter = pids
    .map((id) => encodeURIComponent(`"${escapeSolrValue(id)}"`))
    .join(',');
  const guidelineContext = guidelineTitle.trim()
    ? `&guideline=${encodeURIComponent(guidelineTitle.trim())}`
    : '';

  return `/${SEARCH_PAGE_PATH}/${SERVICES_URL_PARAM_NAME}?q=*&fq=pid:(${pidFilter})${guidelineContext}`;
};
