import { IFacetBucket } from '../search/facet-response.interface';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

export const facetBucketToFilter = (
  bucket: IFacetBucket
): NzTreeNodeOptions => ({
  title: `${bucket.val} (${bucket.count})`,
  key: bucket.val + '',
  isLeaf: true,
});
