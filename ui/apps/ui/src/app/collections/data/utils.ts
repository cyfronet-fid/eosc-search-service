import {
  IFacetBucket,
  IFilterNode,
  IResult,
  ISecondaryTag,
} from '@collections/repositories/types';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { facetToFlatNodes } from '@components/filters/utils';
import { COUNTRY_CODE_TO_NAME } from '@collections/data/config';

export const toDownloadsStatisticsSecondaryTag = (
  data: string | number | null | undefined
): ISecondaryTag => ({
  iconPath: '/assets/usage-downloads.svg',
  values: toValueWithLabel(toArray(data ? `${data} Downloads` : null)),
  type: 'info',
});
export const toViewsStatisticsSecondaryTag = (
  data: string | number | null | undefined
): ISecondaryTag => ({
  iconPath: '/assets/usage-views.svg',
  values: toValueWithLabel(toArray(data ? `${data} Views` : null)),
  type: 'info',
});
export const toKeywordsSecondaryTag = (
  data: string[] | undefined | null,
  filter: string
): ISecondaryTag => ({
  iconPath: '/assets/tag.svg',
  values: toValueWithLabel(toArray(data)),
  filter,
  type: 'url',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseStatistics = (data: any): Partial<IResult> => {
  const views = parseInt(data['usage_counts_views'] ?? '');
  const downloads = parseInt(data['usage_counts_downloads'] ?? '');
  return {
    views: isNaN(views) ? undefined : views,
    downloads: isNaN(downloads) ? undefined : downloads,
    accessRight: data['best_access_right'],
  };
};
export const alphanumericFilterSort = (a: IFilterNode, b: IFilterNode) =>
  a.value.localeCompare(b.value);

export const convertCountryCodeToName = (
  bucketValues: IFacetBucket[]
): IFilterNode[] =>
  facetToFlatNodes(bucketValues, 'country').map((node) => ({
    ...node,
    name:
      node.name in COUNTRY_CODE_TO_NAME
        ? COUNTRY_CODE_TO_NAME[node.name]
        : node.name,
  }));
