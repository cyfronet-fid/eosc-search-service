import { IResult, ISecondaryTag } from '@collections/repositories/types';
import { toArray } from '@collections/filters-serializers/utils';

export const toDownloadsStatisticsSecondaryTag = (
  data: string | number | null | undefined
): ISecondaryTag => ({
  iconPath: '/assets/usage-downloads.svg',
  values: toArray(data ? `${data} Downloads` : null),
  type: 'info',
});
export const toViewsStatisticsSecondaryTag = (
  data: string | number | null | undefined
): ISecondaryTag => ({
  iconPath: '/assets/usage-views.svg',
  values: toArray(data ? `${data} Views` : null),
  type: 'info',
});
export const toKeywordsSecondaryTag = (
  data: string[] | undefined | null,
  filter: string
): ISecondaryTag => ({
  iconPath: '/assets/tag.svg',
  values: toArray(data),
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
