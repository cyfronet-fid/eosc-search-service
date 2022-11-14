import { ISecondaryTag } from '@collections/repositories/types';
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
