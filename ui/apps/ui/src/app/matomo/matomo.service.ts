import {
  DestroyRef,
  EnvironmentProviders,
  Inject,
  Injectable,
  Injector,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import {
  MatomoInitializerService,
  MatomoTracker,
  provideMatomo,
} from 'ngx-matomo-client';
import { filter } from 'rxjs';
import { isEqual } from 'lodash-es';
import {
  ICustomRouteProps,
  SEARCH_PAGE_PATH,
} from '@collections/services/custom-route.type';
import { environment } from '@environment/environment';
import { ISearchResults } from '@collections/repositories/types';
import { BackendConfig } from '../services/config.service';
import { clickThroughCategory } from './click-through';

type MatomoSettings = Pick<BackendConfig, 'matomo_url' | 'matomo_site_id'>;
type SearchParams = Pick<ICustomRouteProps, 'collection' | 'q' | 'fq'>;
type SearchResponse = Pick<ISearchResults<never>, 'numFound' | 'isError'>;

/**
 * Matomo is configured in deferred mode: nothing is loaded and nothing is
 * tracked until MatomoService.start() gets Matomo settings from /config.
 */
export const provideMatomoTracking = (): EnvironmentProviders =>
  provideMatomo({
    mode: 'deferred',
    trackAppInitialLoad: false,
    enableLinkTracking: false,
  });

/** A search page's URL without its query, so filters don't split it */
const searchPageUrl = (collection: string): string =>
  `/${SEARCH_PAGE_PATH}/${collection}`;

@Injectable({ providedIn: 'root' })
export class MatomoService {
  // The URL of the page the visitor is on, used as the next hit's referrer
  private _pageUrl: string | null = null;
  // The search sent last since the visitor came to the search pages
  private _lastSearch: SearchParams | null = null;
  // Looked up only once Matomo is on, so that nothing using this service
  // needs Matomo's providers while it is off (specs, for example)
  private _tracker: MatomoTracker | null = null;

  constructor(
    private _injector: Injector,
    private _router: Router,
    private _destroyRef: DestroyRef,
    private _title: Title,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  start(settings: MatomoSettings): void {
    if (!settings.matomo_url || settings.matomo_site_id == null) {
      return;
    }

    const tracker = this._injector.get(MatomoTracker);
    this._tracker = tracker;
    tracker.disableCookies();
    // The default since Matomo 4, made explicit: a click-through's hit must
    // survive the page being left for the result
    tracker.alwaysUseSendBeacon();
    this._injector.get(MatomoInitializerService).initializeTracker({
      trackerUrl: settings.matomo_url,
      siteId: settings.matomo_site_id,
    });
    this._trackPageViews(tracker);
    this._trackClickThroughs(tracker);
  }

  /**
   * Call with each search response. Only a change of q, the collection or
   * the filters is a new search; paging and sorting are not. Coming back to
   * the search pages from another page is a new search too. A failed
   * search is not sent, as it would count as one that found nothing.
   */
  trackSearch(search: SearchParams, response: SearchResponse): void {
    const { collection, q, fq } = search;
    if (
      this._tracker === null ||
      response.isError ||
      isEqual({ collection, q, fq }, this._lastSearch)
    ) {
      return;
    }
    this._lastSearch = { collection, q, fq };

    this._tracker.trackSiteSearch(
      // q=* lists the whole collection, so there is no keyword
      search.q === '*' ? '' : search.q,
      search.collection ?? '',
      response.numFound
    );
  }

  private _trackPageViews(tracker: MatomoTracker): void {
    this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((event) => {
        const collection = this._searchCollection(event.urlAfterRedirects);
        if (collection !== null) {
          // Search pages send a site search instead, see trackSearch()
          this._enterPage(tracker, searchPageUrl(collection));
          return;
        }
        this._lastSearch = null;
        this._enterPage(tracker, event.urlAfterRedirects);
        tracker.setDocumentTitle(this._title.getTitle());
        tracker.trackPageView();
      });
  }

  /** The collection of a search page URL, or null for other pages */
  private _searchCollection(routerUrl: string): string | null {
    const segments =
      this._router.parseUrl(routerUrl).root.children[PRIMARY_OUTLET]
        ?.segments ?? [];
    return segments[0]?.path === SEARCH_PAGE_PATH
      ? segments[1]?.path ?? ''
      : null;
  }

  /** Makes the next hits come from `routerUrl`, referred by the last page */
  private _enterPage(tracker: MatomoTracker, routerUrl: string): void {
    // Router URLs start with "/" but are relative to <base href>
    const pageUrl = new URL(
      routerUrl.replace(/^\//, ''),
      this._document.baseURI
    ).href;
    if (this._pageUrl !== null) {
      // The first hit keeps Matomo's default referrer, document.referrer
      tracker.setReferrerUrl(this._pageUrl);
    }
    tracker.setCustomUrl(pageUrl);
    this._pageUrl = pageUrl;
  }

  /**
   * Result links go through the backend's /navigate redirect, which no
   * analytics sees, so clicks on them are tracked here. Middle clicks open
   * the result too, so they count.
   */
  private _trackClickThroughs(tracker: MatomoTracker): void {
    const navigateUrl = new URL(
      `${environment.backendApiPath}/${environment.navigationApiPath}`,
      this._document.baseURI
    );
    const onClick = (event: MouseEvent) => {
      if (event.type === 'auxclick' && event.button !== 1) {
        return;
      }
      const link =
        event.target instanceof Element
          ? event.target.closest('a[href]')
          : null;
      if (link === null) {
        return;
      }
      const url = new URL(
        link.getAttribute('href') ?? '',
        this._document.baseURI
      );
      if (
        url.origin !== navigateUrl.origin ||
        url.pathname !== navigateUrl.pathname
      ) {
        return;
      }
      const category = clickThroughCategory(
        url.searchParams.get('resource_type')
      );
      if (category === undefined) {
        return;
      }
      tracker.trackEvent(
        category,
        'ClickThrough',
        url.searchParams.get('event_name') ?? undefined
      );
    };

    // Capture, so that handlers stopping propagation can't hide a click
    this._document.addEventListener('click', onClick, true);
    this._document.addEventListener('auxclick', onClick, true);
    this._destroyRef.onDestroy(() => {
      this._document.removeEventListener('click', onClick, true);
      this._document.removeEventListener('auxclick', onClick, true);
    });
  }
}
