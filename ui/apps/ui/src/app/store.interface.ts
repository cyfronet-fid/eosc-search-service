import { ISearchResults } from './search/search-results.interface';

export interface IStore<T> {
  set(results: ISearchResults<T>): void;
  setActive(item: T): void;
}
