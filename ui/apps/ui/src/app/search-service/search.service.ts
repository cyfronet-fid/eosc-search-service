/* eslint-disable @typescript-eslint/no-explicit-any  */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IFacetResponse, ISearchResults } from './search-results.interface';
import { BehaviorSubject, catchError, forkJoin, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CollectionSearchMetadata } from '../collections/collection.model';
import { IResult } from '../result/result.model';
import { shuffleArray } from './utils';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  static _URL = `/${environment.backendApiPath}/${environment.search.apiPath}`;

  hasNextPage$ = new BehaviorSubject(true);
  maxResultsNumber$ = new BehaviorSubject(0);
  filters$ = new BehaviorSubject<
    [CollectionSearchMetadata<any>, { [facetName: string]: IFacetResponse }][]
  >([]);

  protected _collections$ = new BehaviorSubject<
    CollectionSearchMetadata<any>[]
  >([]);

  constructor(private _http: HttpClient) {}

  async get$<T>(
    ...collectionsMetadata: CollectionSearchMetadata<any>[]
  ): Promise<IResult[]> {
    return (
      (await forkJoin(
        collectionsMetadata.map((metadata) => {
          metadata.params.cursor = '*';
          return this._get$<T>(metadata);
        })
      )
        .pipe(
          // update max results
          tap((allResults: ISearchResults<T>[]) =>
            this.maxResultsNumber$.next(
              allResults
                .map(({ numFound }) => numFound)
                .reduce((acc, size) => acc + size, 0)
            )
          ),
          // update search information
          tap((allResults) => {
            allResults.forEach((result, index) => {
              const collection = collectionsMetadata[index];
              collection.params.cursor = result.nextCursorMark;
              collection.maxResults = result.numFound;
              collection.maxPage = Math.ceil(
                result.numFound / collection.params.rows
              );
              collection.hasNext = collection.currentPage < collection.maxPage;
            });
            this.hasNextPage$.next(
              collectionsMetadata.some((collection) => collection.hasNext)
            );
            this._collections$.next(collectionsMetadata);
          }),
          tap((allResults) => {
            this.filters$.next(
              allResults.map((result, index) => [
                collectionsMetadata[index],
                result.facets,
              ])
            );
          }),
          // return merged data
          map((allResults: ISearchResults<T>[]) =>
            allResults
              .map((results, index) =>
                results.results.map(collectionsMetadata[index].inputAdapter)
              )
              .reduce((acc, results) => [...acc, ...results], [])
          ),
          map((results) =>
            collectionsMetadata.length > 1 ? shuffleArray(results) : results
          )
        )
        .toPromise()) || []
    );
  }
  async nextPage$<T>(): Promise<IResult[]> {
    const collectionsWithNextPage = this._collections$
      .getValue()
      .filter((collection) => collection.hasNext);
    return (
      (await forkJoin(
        collectionsWithNextPage.map((collection) => this._get$<T>(collection))
      )
        .pipe(
          // update search information
          tap((allResults: ISearchResults<T>[]) => {
            allResults.forEach((result, index) => {
              const collection = collectionsWithNextPage[index];
              collection.params.cursor = result.nextCursorMark;
              collection.maxResults = result.numFound;
              collection.maxPage = Math.ceil(
                result.numFound / collection.params.rows
              );
              collection.hasNext = collection.currentPage < collection.maxPage;
            });
            this.hasNextPage$.next(
              collectionsWithNextPage.some((collection) => collection.hasNext)
            );
          }),
          // return merged data
          map((allResults: ISearchResults<T>[]) =>
            allResults
              .map((results, index) =>
                results.results.map(collectionsWithNextPage[index].inputAdapter)
              )
              .reduce((acc, results) => [...acc, ...results], [])
          ),
          map((results) =>
            collectionsWithNextPage.length > 1 ? shuffleArray(results) : results
          )
        )
        .toPromise()) || []
    );
  }

  _get$<T>(collectionSearchMetadata: CollectionSearchMetadata<any>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { facets, params, ...rest } = collectionSearchMetadata;
    return this._http
      .post<ISearchResults<T>>(
        SearchService._URL,
        { facets },
        { params: params.toJson() }
      )
      .pipe(
        catchError(() =>
          of({
            results: [],
            numFound: 0,
            nextCursorMark: '',
            facets: {},
          } as ISearchResults<T>)
        )
      );
  }
}
