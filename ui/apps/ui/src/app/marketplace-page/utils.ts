import {
  IFacetBucket,
  IFacetResponse,
} from '../search/facet-response.interface';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

const pick = <T>(obj: T, keys: string[]) => {
  const picked = {};
  Object.assign(
    picked,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...keys.map((key) => ({ [key]: obj[key] }))
  );
  return picked;
};

export const filterContainingBuckets = (facets: {
  [name: string]: IFacetResponse;
}): { [name: string]: IFacetResponse } =>
  pick(
    facets,
    Object.keys(facets).filter((facet) => !!facets[facet].buckets)
  );

export const toTreeParams = (facets: { [name: string]: IFacetResponse }) =>
  Object.keys(facets).map((facet) => facetToTreeParam(facet, facets[facet]));
export const facetToTreeParam = (label: string, facet: IFacetResponse) => ({
  label,
  buckets: facet.buckets.map(facetBucketToFilter),
  isLeaf: true,
});

export const facetBucketToFilter = (
  bucket: IFacetBucket
): NzTreeNodeOptions => ({
  title: `${bucket.val} (${bucket.count})`,
  key: bucket.val + '',
  isLeaf: true,
});
