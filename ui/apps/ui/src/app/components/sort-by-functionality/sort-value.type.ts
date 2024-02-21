export type sortType = 'pdmr' | 'pdlr' | 'dmr' | 'dlr' | 'mp' | 'r' | 'default';
export const DEFAULT_SORT: sortType = 'default';

export function isSortOption(obj: string): obj is sortType {
  return ['pdmr', 'pdlr', 'dlr', 'dmr', 'mp', 'r', 'default'].includes(obj);
}
