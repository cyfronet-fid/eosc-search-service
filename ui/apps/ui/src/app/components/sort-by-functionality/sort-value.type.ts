export type sortType = 'r' | 'dmr' | 'dlr' | 'mp';
export const DEFAULT_SORT: sortType = 'dmr';

export function isSortOption(obj: string): obj is sortType {
  return ['dlr', 'dmr', 'mp', 'r'].includes(obj);
}
