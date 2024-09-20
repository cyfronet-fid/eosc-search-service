import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import {
  EU_CONTEXT_COLLECTIONS,
  PL_CONTEXT_COLLECTIONS,
} from '@collections/data/config';
import { ConfigService } from '../../services/config.service';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { AdaptersRepository } from '@collections/repositories/adapters.repository';
import { DEFAULT_SCOPE } from '@collections/services/custom-route.service';

@Component({
  selector: 'ess-top-menu',
  template: `
    <div class="prefix-buttons">
      <button [class.active]="selectedScope === 'pl'" (click)="setScope('pl')">
        Browse Polish Resources
      </button>

      <button [class.active]="selectedScope === 'eu'" (click)="setScope('eu')">
        Browse EU Resources
      </button>
    </div>
  `,
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {
  public selectedScope: string = DEFAULT_SCOPE;
  showBetaCollections: boolean = ConfigService.config?.show_beta_collections;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _navConfigRepository: NavConfigsRepository,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _adaptersRepository: AdaptersRepository,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.selectedScope =
      this._route.snapshot.queryParamMap.get('scope') || DEFAULT_SCOPE;
  }

  async setScope(scope: string) {
    if (this.selectedScope != scope) {
      const targetScope = scope;
      const targetCollection = this.setCollection(targetScope);
      this.selectedScope = targetScope;
      await this._router.navigate(
        [`${SEARCH_PAGE_PATH}/${targetCollection}/`],
        {
          queryParams: {
            scope: targetScope,
          },
          queryParamsHandling: 'merge',
        }
      );
      this._navConfigRepository.getResourcesCollections();
      this._filtersConfigsRepository.setScope();
      this._searchMetadataRepository.setScope(targetScope);
      this._adaptersRepository.setScope();
    }
  }

  setCollection(targetScope: string) {
    const currentCollection: string = this._customRoute.collection() || '';
    const availableCollections: string[] =
      targetScope == 'pl' ? PL_CONTEXT_COLLECTIONS : EU_CONTEXT_COLLECTIONS;
    const targetCollection: string = availableCollections.includes(
      currentCollection
    )
      ? currentCollection
      : 'all_collection';
    return targetCollection;
  }
}
