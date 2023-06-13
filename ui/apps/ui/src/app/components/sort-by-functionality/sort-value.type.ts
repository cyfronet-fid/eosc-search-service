export type sortType = 'dmr' | 'dlr' | 'mp' | 'r' | 'default';
export const DEFAULT_SORT: sortType = 'default';

export function isSortOption(obj: string): obj is sortType {
  return ['dlr', 'dmr', 'mp', 'r', 'default'].includes(obj);
}
