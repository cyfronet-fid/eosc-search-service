import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import {
  EU_CONTEXT_COLLECTIONS,
  PL_CONTEXT_COLLECTIONS,
  SPECIAL_COLLECTIONS,
} from '@collections/data/config';
import { ConfigService } from '../../services/config.service';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';

@Component({
  selector: 'ess-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {
  public q$ = this._customRoute.q$;
  public st$ = this._customRoute.standard$;
  public tg$ = this._customRoute.tags$;
  public ex$ = this._customRoute.exact$;
  public radioValueAuthor$ = this._customRoute.radioValueAuthor$;
  public radioValueExact$ = this._customRoute.radioValueExact$;
  public radioValueTitle$ = this._customRoute.radioValueTitle$;
  public radioValueKeyword$ = this._customRoute.radioValueKeyword$;
  public selected = 'main';
  public selectedPrefix: string = 'pl';
  showBetaCollections: boolean = ConfigService.config?.show_beta_collections;

  constructor(private _customRoute: CustomRoute, private _router: Router) {}

  ngOnInit() {
    this._customRoute.collection$.subscribe((val) => {
      if (SPECIAL_COLLECTIONS.includes(val)) {
        this.selected = val;
      } else {
        this.selected = 'main';
      }
    });

    const storedPrefix = localStorage.getItem('COLLECTIONS_PREFIX');
    this.selectedPrefix = storedPrefix ? storedPrefix : 'pl';
  }

  setPrefix(prefix: string) {
    localStorage.setItem('COLLECTIONS_PREFIX', prefix);
    this.selectedPrefix = prefix;
    this.setCollection();

    // TODO: Make this an observable and reload only the affected components
  }
  async setCollection() {
    const currentCollection: string = this._customRoute.collection() || '';
    const availableCollections: string[] =
      this.selectedPrefix == 'pl'
        ? PL_CONTEXT_COLLECTIONS
        : EU_CONTEXT_COLLECTIONS;
    const collectionFound: boolean =
      availableCollections.includes(currentCollection);

    if (!collectionFound) {
      await this._router.navigate([`${SEARCH_PAGE_PATH}/all_collection`], {
        queryParamsHandling: 'merge',
      });
    }
    window.location.reload();
  }
}
