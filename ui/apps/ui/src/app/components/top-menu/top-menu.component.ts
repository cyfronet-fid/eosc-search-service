import { Component, OnInit } from '@angular/core';
import { CustomRoute } from '@collections/services/custom-route.service';

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

  constructor(private _customRoute: CustomRoute) {}

  ngOnInit() {
    this._customRoute.collection$.subscribe((val) => {
      if (val == 'provider') {
        this.selected = val;
      } else {
        this.selected = 'main';
      }
    });
  }
}
