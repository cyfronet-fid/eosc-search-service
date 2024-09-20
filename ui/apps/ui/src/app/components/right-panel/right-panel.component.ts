import { Component } from '@angular/core';
import { CustomRoute } from '@collections/services/custom-route.service';

@Component({
  selector: 'ess-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent {
  public q$ = this._customRoute.q$;
  public st$ = this._customRoute.standard$;
  public tg$ = this._customRoute.tags$;
  public ex$ = this._customRoute.exact$;
  public scope$ = this._customRoute.scope$;
  public radioValueAuthor$ = this._customRoute.radioValueAuthor$;
  public radioValueExact$ = this._customRoute.radioValueExact$;
  public radioValueTitle$ = this._customRoute.radioValueTitle$;
  public radioValueKeyword$ = this._customRoute.radioValueKeyword$;

  constructor(private _customRoute: CustomRoute) {}

  isProvider() {
    return this._customRoute.collection() == 'provider';
  }
}
