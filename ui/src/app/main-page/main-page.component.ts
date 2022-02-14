import {Component, OnInit} from '@angular/core';
import {MocksService} from "./mocks.service";
import {Observable, Subscriber} from "rxjs";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  searchResults$!: Observable<any>
  filters$!: Observable<any>

  labels$ = this._mocksService.getLabels$()
  categories$ = this._mocksService.getCategories$()
  recommendations$ = this._mocksService.getRecommendations$()
  recommendedResources$ = this._mocksService.getRecommendedResources$()

  constructor(private _mocksService: MocksService) { }

  ngOnInit(): void {
    let searchResultsObs: Subscriber<any>
    let filtersObs: Subscriber<any>;

    this.searchResults$ = new Observable(_searchResultsObs => searchResultsObs = _searchResultsObs)
    this.filters$ = new Observable(_filtersObs => filtersObs = _filtersObs)

    this._mocksService.getSearchResults$(
      "*",
      "oag_researchoutcomes_prod_20211208_v2",
      MainPageComponent.getFacetsFor([
        "subject", "publisher", "bestaccessright", "language", "journal", "organization_names", "project_titles"
      ])
    ).subscribe(response => {
      searchResultsObs.next(
        response["results"].map((res : any) => {
          return {
            id: res["id"],
            title: res["title"],
            author_names: res["author_names"],
            rating: MainPageComponent.randomRating()
          }
        })
      )

      const filters = []
      for (const key in response["facets"]) {
        if (key === "count") {
          continue
        }
        filters.push({
          label: key,
          buckets: response["facets"][key]["buckets"].map((bucket : any) => {
            return {
              title: bucket["val"] + " (" + bucket["count"] + ")",
              key: bucket["val"],
              isLeaf: true
            }
          })
        })
      }
      filtersObs.next(filters)
    })
  }

  private static randomRating(): number {
    return Math.random() * 5
  }

  private static getFacetsFor(fields: Array<string>): object {
    const out: any = {}
    for (const field of fields) {
      out[field] = { type: "terms", field }
    }
    return out
  }
}
