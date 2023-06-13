export type sortType = 'dmr' | 'dlr' | 'mp' | 'default';
// export type sortType = 'r' | 'dmr' | 'dlr' | 'mp';
export const DEFAULT_SORT: sortType = 'default';

export function isSortOption(obj: string): obj is sortType {
  return ['dlr', 'dmr', 'mp', 'default'].includes(obj); // return ['dlr', 'dmr', 'mp', 'r'].includes(obj);
}
