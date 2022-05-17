import { ISearchResults } from './search-service/search-results.interface';

export interface IStore<T> {
  set(results: ISearchResults<T>): void;
  setActive(item: T): void;
}
