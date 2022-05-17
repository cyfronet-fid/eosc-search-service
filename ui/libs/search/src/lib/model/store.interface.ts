import {ISearchResults} from "./articles";

export interface IStore<T> {
  set(results: ISearchResults<T>): void;
  setActive(item: T): void;
}
