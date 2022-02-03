import { Component } from '@angular/core';
import {MocksService} from "./mocks.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  searchResults$ = this._mocksService.getSearchResults$()
  labels$ = this._mocksService.getLabels$()
  categories$ = this._mocksService.getCategories$()
  filters$ = this._mocksService.getFilters$()
  recommendations$ = this._mocksService.getRecommendations$()
  recommendedResources$ = this._mocksService.getRecommendedResources$()

  constructor(private _mocksService: MocksService) { }
}
