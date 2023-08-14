import {
  AccessRight,
  IFacetBucket,
  IFilterNode,
  IResult,
  ISecondaryTag,
  IValueWithLabelAndLink,
  Pids,
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

// default sort type, but it is unused as solr returns correct ordering
export const countFilterSort = (a: IFilterNode, b: IFilterNode) => {
  const ordering = +b.count - +a.count;
  if (ordering === 0) {
    return a.value.localeCompare(b.value);
  }
  return ordering;
};

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

const resolveDoiLink = (rawDoi: string): string | undefined => {
  const doiRegex = new RegExp('^10\\.\\d{4,9}/[-._;()/:A-Za-z0-9]+$');
  return doiRegex.test(rawDoi) ? `https://doi.org/${rawDoi}` : undefined;
};

const resolveHandleLink = (rawHandle: string): string | undefined => {
  const handleRegex = new RegExp('^http+$|^\\S+/\\S+$');
  if (!handleRegex.test(rawHandle)) return undefined;

  return rawHandle.startsWith('http')
    ? rawHandle
    : `https://hdl.handle.net/${rawHandle}`;
};

const resolvePmcLink = (rawPmc: string): string | undefined => {
  const pmcRegex = new RegExp('^PMC\\d+$');

  if (!pmcRegex.test(rawPmc)) return undefined;
  const urlPart = rawPmc.split('PMC')[1];

  return pmcRegex.test(rawPmc)
    ? `https://europepmc.org/article/PMC/${urlPart}`
    : undefined;
};

const resolvePmidLink = (rawPmid: string): string | undefined => {
  const pmidRegex = new RegExp('^\\d+$');
  return pmidRegex.test(rawPmid)
    ? `https://pubmed.ncbi.nlm.nih.gov/${rawPmid}`
    : undefined;
};

export const constructIdentifierTag = (
  rawPids?: string
): IValueWithLabelAndLink[] => {
  const pids = rawPids ? (JSON.parse(rawPids) as Pids) : undefined;
  if (!pids) return [];

  const transformToValueWithLabelAndLink = (
    idName: string,
    id: string,
    link: string | undefined
  ): IValueWithLabelAndLink => ({
    value: id,
    label: id,
    subTitle: idName,
    externalLink: { link },
  });

  return [
    ...pids.doi.map((id) =>
      transformToValueWithLabelAndLink('DOI', id, resolveDoiLink(id))
    ),
    ...pids.pmc.map((id) =>
      transformToValueWithLabelAndLink('PMC', id, resolvePmcLink(id))
    ),
    ...pids.handle.map((id) =>
      transformToValueWithLabelAndLink('HANDLE', id, resolveHandleLink(id))
    ),
    ...pids.pmid.map((id) =>
      transformToValueWithLabelAndLink('PMID', id, resolvePmidLink(id))
    ),
  ];
};
