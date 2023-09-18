export type sortType = 'dmr' | 'dlr' | 'mp' | 'r' | 'bm';
export const BEST_MATCH_SORT: sortType = 'bm';

export function isSortOption(obj: string): obj is sortType {
  return ['dlr', 'dmr', 'mp', 'r', 'bm'].includes(obj);
}
