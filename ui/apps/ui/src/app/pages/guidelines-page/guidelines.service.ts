import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, map } from 'rxjs';
import { COLLECTION } from '@collections/data/guidelines/search-metadata.data';
import { IService } from '@collections/data/services/service.model';
import { IProvider } from '@collections/data/providers/provider.model';
import { FetchDataService } from '@collections/services/fetch-data.service';
import { AdaptersRepository } from '@collections/repositories/adapters.repository';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import {
  ICollectionSearchMetadata,
  adapterType,
} from '@collections/repositories/types';
import { queryChanger } from '@collections/filters-serializers/utils';
import { IGuideline } from '@collections/data/guidelines/guideline.model';

@Injectable({ providedIn: 'root' })
export class GuidelinesService {
  endpointUrl = `/${environment.backendApiPath}/${COLLECTION}`;

  constructor(
    private _http: HttpClient,
    private _fetchDataService: FetchDataService,
    private _adaptersRepository: AdaptersRepository,
    private _searchMetadataRepository: SearchMetadataRepository
  ) {}

  get$(id: number | string): Observable<IGuideline> {
    return this._http.get<IGuideline>(`${this.endpointUrl}/${id}`);
  }

  getProviderNameByPid$(q: string, collections: ICollectionSearchMetadata[]) {
    q = queryChanger(q);
    return collections.map((metadata) => {
      const searchMetadata = {
        q,
        fq: [],
        rows: 1,
        cursor: '*',
        sort: [],
        ...metadata.params,
      };
      const adapter = this._adaptersRepository.get('guideline')
        ?.adapter as adapterType;
      return this._fetchDataService
        .fetchResults$(searchMetadata, metadata.facets, adapter)
        .pipe(map((results) => ({ ...results, link: metadata.id })));
    });
  }

  getFromProviderById$(id: number | string): Observable<any> {
    const endpoint = `/${environment.backendApiPath}/related_services?guideline_id=`;
    return this._http.get<IService[]>(`${endpoint}${id}`);
  }

  getFromProviderByPid$(pid: number | string): Observable<any> {
    const endpoint = `/${environment.backendApiPath}/provider/${pid}`;
    return this._http.get<IProvider[]>(`${endpoint}`);
  }
}
