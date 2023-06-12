export type sortType = 'dmr' | 'dlr' | 'mp';
// export type sortType = 'r' | 'dmr' | 'dlr' | 'mp';
export const DEFAULT_SORT: sortType = 'mp';

export function isSortOption(obj: string): obj is sortType {
  return ['dlr', 'dmr', 'mp'].includes(obj); // return ['dlr', 'dmr', 'mp', 'r'].includes(obj);
}
