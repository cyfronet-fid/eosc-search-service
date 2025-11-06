import { Component, OnInit } from '@angular/core';
import { CustomRoute } from '@collections/services/custom-route.service';
import { INavigationLink } from './type';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { toNavigationLink } from './utils';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'ess-collections-navigation',
  template: `
    <nav class="top-nav d-none d-md-block">
      <div class="container--xxl navigation">
        <ul class="main-menu">
          <li class="has-submenu">
            <a class="menu-top-level">
              <img
                src="assets/main-menu-01.svg"
                alt="Research Outputs"
                class="icon"
              />
              Research Outputs
            </a>
            <div class="submenu">
              <div class="left">
                <a
                  [routerLink]="['/search', 'dataset']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Datasets</div>
                  <div class="desc">
                    Access curated or raw datasets with metadata for analysis.
                  </div>
                </a>
                <a
                  [routerLink]="['/search', 'publication']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Publications</div>
                  <div class="desc">Browse articles, papers, and reports.</div>
                </a>
                <a
                  [routerLink]="['/search', 'software']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Software</div>
                  <div class="desc">
                    Find tools and applications to support research.
                  </div>
                </a>
              </div>
              <div class="right">
                <div class="title">Research Outputs</div>
                Browse publications and datasets from scientific projects.
              </div>
            </div>
          </li>

          <li class="has-submenu">
            <a class="menu-top-level">
              <img
                src="assets/main-menu-02.svg"
                alt="Service Offerings"
                class="icon"
              />
              Service Offerings
            </a>
            <div class="submenu">
              <div class="left">
                <a
                  [routerLink]="['/search', 'deployable_service']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Ready-to-run services</div>
                  <div class="desc">
                    Deploy open-source services automatically on cloud via TOSCA
                    templates.
                  </div>
                </a>
                <a
                  [routerLink]="['/search', 'service']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Services</div>
                  <div class="desc">
                    Explore compute, data processing, storage, and analysis
                    services.
                  </div>
                </a>
                <a href="#" class="item" style="display: none;">
                  <div class="title">Offers</div>
                  <div class="desc">
                    View available service plans or configurations.
                  </div>
                </a>
                <a
                  [routerLink]="['/search', 'bundle']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                  style="display: none;"
                >
                  <div class="title">Bundles</div>
                  <div class="desc">
                    Discover packages combining multiple services.
                  </div>
                </a>
              </div>
              <div class="right">
                <div class="title">Service Offerings</div>
                Discover and access to compute, storage, data-processing, and
                other services.
              </div>
            </div>
          </li>

          <li class="has-submenu">
            <a class="menu-top-level">
              <img
                src="assets/main-menu-03.svg"
                alt="Providers & Data Sources"
                class="icon"
              />
              Providers & Data Sources
            </a>
            <div class="submenu">
              <div class="left">
                <a
                  [routerLink]="['/search', 'data_source']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Data sources</div>
                  <div class="desc">
                    Find original data providers or endpoints where data is
                    collected.
                  </div>
                </a>
                <a
                  [routerLink]="['/search', 'catalogue']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Catalogues</div>
                  <div class="desc">
                    Browse listings of available data collections and
                    repositories.
                  </div>
                </a>
                <a
                  [routerLink]="['/search', 'provider']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Providers</div>
                  <div class="desc">
                    Browse list of providers offering platform services.
                  </div>
                </a>
                <a
                  [routerLink]="['/search', 'organisation']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Organisations</div>
                  <div class="desc">
                    Discover universities, institutes, or research bodies
                    contributing to EOSC.
                  </div>
                </a>
              </div>
              <div class="right">
                <div class="title">Providers & Data Sources</div>
                Explore service providers and data repositories or endpoints.
              </div>
            </div>
          </li>

          <li class="has-submenu">
            <a class="menu-top-level">
              <img
                src="assets/main-menu-04.svg"
                alt="Standards & Adapters"
                class="icon"
              />
              Standards & Adapters
            </a>
            <div class="submenu">
              <div class="left">
                <a href="/search/adapter?q=*" class="item">
                  <div class="title">Adapters</div>
                  <div class="desc">
                    Integration adapters enabling composability of services.
                  </div>
                </a>
                <a
                  [routerLink]="['/search', 'guideline']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Interoperability Guidelines</div>
                  <div class="desc">
                    Access standards and best practices for seamless
                    integration.
                  </div>
                </a>
              </div>
              <div class="right">
                <div class="title">Standards & Adapters</div>
                Access interoperability standards, configuration templates, and
                integration adapters.
              </div>
            </div>
          </li>

          <li class="has-submenu align-right" *ngIf="showKnowledgeBase">
            <a class="menu-top-level">
              <img
                src="assets/main-menu-05.svg"
                alt="Knowledge Base"
                class="icon"
              />
              Knowledge Base
            </a>
            <div class="submenu">
              <div class="left">
                <a
                  [routerLink]="['/search', 'training']"
                  [queryParams]="{
                    q: (q$ | async),
                    standard: (st$ | async),
                    exact: (ex$ | async),
                    radioValueAuthor: (radioValueAuthor$ | async),
                    radioValueExact: (radioValueExact$ | async),
                    radioValueTitle: (radioValueTitle$ | async),
                    radioValueKeyword: (radioValueKeyword$ | async)
                  }"
                  class="item"
                >
                  <div class="title">Trainings</div>
                  <div class="desc">
                    Find courses, tutorials, and workshops to build your skills
                    on the platform.
                  </div>
                </a>
              </div>
              <div class="right">
                <div class="title">Knowledge Base</div>
                Learn via courses, tutorials, workshops, and user guides.
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container--xxl search-results-info" *ngIf="q$ | async as query">
      <ng-container *ngIf="query && query !== '*'">
        Your search results for: “{{ query }}”
      </ng-container>
    </div>

    <div class="container--xxl navigation">
      <div id="sub-nav" class="d-md-none">
        <div id="bottom-border-wrapper">
          <a
            class="nav-btn {{ link.label }}"
            *ngFor="let link of navigationLinks"
            [routerLink]="link.routerLink"
            [routerLinkActiveOptions]="{
              queryParams: 'ignored',
              paths: 'exact',
              matrixParams: 'ignored',
              fragment: 'ignored'
            }"
            routerLinkActive="active"
            [queryParams]="{
              q: (q$ | async),
              fq: (globalFq$(link.id) | async),
              standard: (st$ | async),
              tags: (tg$ | async),
              exact: (ex$ | async),
              radioValueAuthor: (radioValueAuthor$ | async),
              radioValueExact: (radioValueExact$ | async),
              radioValueTitle: (radioValueTitle$ | async),
              radioValueKeyword: (radioValueKeyword$ | async)
            }"
            >{{ link.label }}</a
          >
        </div>
      </div>

      <nav
        aria-label="breadcrumb"
        *ngIf="activeNavConfig$ | async as activeNavConfig"
      >
        <ol class="breadcrumb">
          <ng-container
            *ngFor="
              let breadcrumb of activeNavConfig.breadcrumbs;
              let last = last
            "
          >
            <li
              class="breadcrumb-item"
              [class.active]="last"
              [attr.aria-current]="last ? 'page' : null"
            >
              <a
                *ngIf="!last && breadcrumb.url"
                [routerLink]="breadcrumb.url"
                >{{ breadcrumb.label }}</a
              >
              <span *ngIf="last || !breadcrumb.url">{{
                breadcrumb.label
              }}</span>
            </li>
            <li class="breadcrumb-separator" aria-hidden="true" *ngIf="!last">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.146 3.646a.5.5 0 0 1 .708 0L10.5 8l-4.646 4.354a.5.5 0 0 1-.708-.708L9.293 8 5.146 4.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </li>
          </ng-container>
        </ol>
      </nav>
    </div>
  `,
})
export class CollectionsNavigationComponent implements OnInit {
  public navigationLinks: INavigationLink[] = [];
  public showCollections = false;
  public activeNavConfig$ = this._navConfigsRepository.activeEntity$;
  public q$ = this._customRoute.q$;
  public st$ = this._customRoute.standard$;
  public tg$ = this._customRoute.tags$;
  public ex$ = this._customRoute.exact$;
  public radioValueAuthor$ = this._customRoute.radioValueAuthor$;
  public radioValueExact$ = this._customRoute.radioValueExact$;
  public radioValueTitle$ = this._customRoute.radioValueTitle$;
  public radioValueKeyword$ = this._customRoute.radioValueKeyword$;

  constructor(
    private _customRoute: CustomRoute,
    private _navConfigsRepository: NavConfigsRepository,
    private _config: ConfigService
  ) {}

  ngOnInit() {
    this.navigationLinks = this._navConfigsRepository
      .getResourcesCollections()
      .map(toNavigationLink);
  }

  public globalFq$(collection: string): Observable<string | undefined> {
    return this._customRoute
      .getGlobalFq$(collection)
      .pipe(map((params) => (params.length > 0 ? params : undefined)));
  }

  get showKnowledgeBase(): boolean {
    return this._config.get().show_knowledge_base;
  }
}
