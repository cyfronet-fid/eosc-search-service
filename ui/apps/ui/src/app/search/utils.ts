import { IFacetResponse } from './facet-response.interface';

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
  Object.keys(facets).map((facet) => ({
    label: facet,
    buckets: facets[facet].buckets.map((bucket) => ({
      title: `${bucket.val} (${bucket.count})`,
      key: bucket.val + '',
      isLeaf: true,
    })),
    isLeaf: true,
  }));
