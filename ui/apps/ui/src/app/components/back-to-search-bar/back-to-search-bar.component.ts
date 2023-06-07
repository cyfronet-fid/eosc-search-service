import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ess-back-to-search-bar',
  template: `<div class="eosc-back-search-bar">
    <div class="container">
      <div class="col-md-3 col-12 eosc-back-link">
        <div class="chevron-left"></div>
        <a
          routerLink="/{{ return_path }}"
          [queryParams]="parsedQueryParams"
          i18n
          >Go to Search</a
        >
      </div>
    </div>
  </div>`,
})
export class BackToSearchBarComponent implements OnInit {
  return_path: string | undefined;
  parsedQueryParams: { [id: string]: string[] } = {};

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      this.parsedQueryParams = [
        ...new URLSearchParams(
          decodeURIComponent(params['search_params'])
        ).entries(),
      ].reduce((pv: { [id: string]: string[] }, cv) => {
        if (pv[cv[0]] !== undefined) {
          pv[cv[0]].push(cv[1]);
        } else {
          pv[cv[0]] = [cv[1]];
        }
        return pv;
      }, {});
      this.return_path = params['return_path'];
    });
  }
}
