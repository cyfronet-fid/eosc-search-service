import {Inject, Injectable} from "@angular/core";
import {FiltersRepository} from "./filters.repository";
import {HttpClient} from "@angular/common/http";
import {CommonSettings, ESS_SETTINGS} from "@eosc-search-service/common";
import {forkJoin, map, Observable, of, tap} from "rxjs";
import {updateEntities} from "@ngneat/elf-entities";
import {HashMap, IHasId} from "@eosc-search-service/types";
import {ICollectionSearchMetadata, ISolrQueryParams, toSolrQueryParams} from "../results";
import {ISet} from "../../sets";
import {IFilterEntry} from "./filters.model";

@Injectable({providedIn: 'root'})
export class FiltersService {
  readonly url: string;
  constructor(protected _repository: FiltersRepository, protected http: HttpClient, @Inject(ESS_SETTINGS) protected settings: CommonSettings) {
    this.url = `/${this.settings.backendApiPath}/${this.settings.search.apiPath}`;
  }

  get$() {

  }

  loadNext$() {

  }

  search$(query: string) {

  }

  showMore$(id: string): Observable<unknown> {
    this._repository.store.update(
      updateEntities(id, state => ({...state, showMore: !state.showMore}))
    )

    return of(null)
  }

  searchFilters$(id: string, query: string, queryParams: HashMap<unknown>, activeSet: ISet) {
    console.log(activeSet)
    const params = toSolrQueryParams(queryParams);

    return forkJoin<IFilterEntry[][]>(
      activeSet.collections.map((metadata) => this.fetchMoreForSingle$(id, metadata, params, 0))
    );
  }

  fetchMoreForSingle$<T extends IHasId>(
                      id: string,
                      metadata: ICollectionSearchMetadata<T>,
                      params: ISolrQueryParams,
                      rows: number,): Observable<IFilterEntry[]> {
      const _params = { ...params, ...metadata.params, rows: rows };
      return this.http.post(this.url, {facets: {[id]: {field: id, type: 'terms'}}}, {params: _params})
        .pipe(
          tap(console.log),
          map(() => [])
        )
  }
}
