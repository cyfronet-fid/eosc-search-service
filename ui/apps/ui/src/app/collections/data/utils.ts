import {
  AccessRight,
  IFacetBucket,
  IFilterNode,
  IResult,
  ISecondaryTag,
  IValueWithLabelAndLink,
} from '@collections/repositories/types';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { facetToFlatNodes } from '@components/filters/utils';
import { COUNTRY_CODE_TO_NAME } from '@collections/data/config';
import moment from 'moment';

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
    accessRight: data['best_access_right']?.toLowerCase() as
      | AccessRight
      | undefined,
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

export const formatPublicationDate = (
  publication_date: string[] | string | undefined
) => {
  return publication_date ? moment(publication_date).format('YYYY') : '';
};

export const resolveDoiLink = (rawDoi: string): string | undefined => {
  const doiRegex = new RegExp('^10\\.\\d{4,9}/[-._;()/:A-Za-z0-9]+$');
  return doiRegex.test(rawDoi) ? `https://doi.org/${rawDoi}` : undefined;
};

export const constructDoiTag = (
  doiArr: string[] | undefined
): IValueWithLabelAndLink[] => {
  return toValueWithLabel(toArray(doiArr)).map(({ value, label }) => ({
    value,
    label,
    subTitle: 'DOI',
    externalLink: {
      link: resolveDoiLink(value),
      broken: !resolveDoiLink(value),
    },
  }));
};
