import { Injectable, Injector } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';

export interface BackendConfig {
  marketplace_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // This is a hack to have collection's adapters work without hard refactoring
  // TODO refactor collections so they can take config during initialisation.
  static config: BackendConfig;
  private _config?: BackendConfig;

  constructor(private _http: HttpClient, private injector: Injector) {}

  get(): BackendConfig {
    if (this._config === undefined) {
      throw new Error(
        'call ConfigBootstrapService.load$ before accessing config via `get()`'
      );
    }
    return this._config;
  }

  load$(): Observable<BackendConfig> {
    const url = `${environment.backendApiPath}/config`;
    return this._http.get<BackendConfig>(url).pipe(
      tap((config) => {
        this._config = config;
        ConfigService.config = config;
      })
    );
  }
}
