import { Inject, Injectable } from '@angular/core';
import { Observable, forkJoin, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../app.providers';
import { EoscCommonWindow } from '@components/main-header/types';

export interface BackendConfig {
  eu_marketplace_url: string;
  pl_marketplace_url: string;
  eosc_commons_url: string;
  eosc_commons_env: string;
  eosc_explore_url: string;
  knowledge_hub_url: string;
  is_sort_by_relevance: boolean;
  max_results_by_page: number;
  show_beta_collections: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // This is a hack to have collection's adapters work without hard refactoring
  // TODO refactor collections so they can take config during initialisation.
  static config: BackendConfig;
  private _config?: BackendConfig;

  constructor(
    private _http: HttpClient,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(WINDOW) private _window: EoscCommonWindow
  ) {}

  get(): BackendConfig {
    if (this._config === undefined) {
      throw new Error(
        'call ConfigBootstrapService.load$ before accessing config via `get()`'
      );
    }
    return this._config;
  }

  load$(): Observable<unknown> {
    const url = `${environment.backendApiPath}/config`;
    return this._http.get<BackendConfig>(url).pipe(
      tap((config) => {
        this._config = config;
        ConfigService.config = config;
      }),
      switchMap((config) =>
        forkJoin([
          // this._loadAsset(
          //   `https://eosc-helpdesk.eosc-portal.eu/assets/form/form.js`,
          //   'javascript',
          //   'zammad_form_script'
          // ),
          this._loadAsset(
            `${config.eosc_commons_url}index.${config.eosc_commons_env}.min.js`,
            'javascript'
          ),
          this._loadAsset(
            `${config.eosc_commons_url}index.${config.eosc_commons_env}.min.css`,
            'stylesheet'
          ),
          this._loadAsset(
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
            'stylesheet'
          ),
        ])
      ),
      tap(() => this._initializeCommons())
    );
  }

  private _initializeCommons(): void {
    this._window.eosccommon.renderMainFooter('EoscCommonMainFooter');
    this._window.eosccommon.renderEuInformation('EoscCommonEuInformation');
  }

  private _loadAsset(
    src: string,
    type: 'stylesheet' | 'javascript',
    id?: string,
    async: boolean = false
  ): Observable<HTMLLinkElement | HTMLScriptElement> {
    return new Observable<HTMLLinkElement | HTMLScriptElement>((observer) => {
      let asset: HTMLScriptElement | HTMLLinkElement;

      if (type === 'stylesheet') {
        const link: HTMLLinkElement = this._document.createElement('link');
        link.rel = 'stylesheet';
        link.href = src;
        if (id !== undefined) {
          link.id = id;
        }
        asset = link;
      } else if (type === 'javascript') {
        const script: HTMLScriptElement =
          this._document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        if (id !== undefined) {
          script.id = id;
        }
        script.async = async;
        asset = script;
      } else {
        throw new Error(`Invalid asset type (${type})`);
      }

      asset.onload = () => {
        observer.next(asset);
        observer.complete();
      };
      asset.onerror = (error: unknown) => {
        observer.error(new Error('Could not load ' + src + ' (' + error + ')'));
        observer.complete();
      };
      this._document.getElementsByTagName('head')[0].appendChild(asset);
    });
  }
}
