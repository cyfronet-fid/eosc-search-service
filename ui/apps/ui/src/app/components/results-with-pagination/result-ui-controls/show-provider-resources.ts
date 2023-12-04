import { Component, Input, OnInit } from '@angular/core';
import { DEFAULT_COLLECTION_ID } from '@collections/data';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';

@Component({
  selector: 'ess-providers-resources',
  template: `
    <a style="display: flex;" [attr.href]="url">
      <span class="show-resources-icon"></span>
      <span class="show-resources-text">Show Resources</span>
    </a>
  `,
  styleUrls: ['./show-provider-resources.scss'],
})
export class ShowProviderResourceComponent implements OnInit {
  @Input() public title = '';
  @Input() public id = '';
  public url = '';

  setUrl(): string {
    const fqs = `fq=providers:"${this.title}"&fq=resource_organisation:"${this.title}"`;
    const url = `${SEARCH_PAGE_PATH}/${DEFAULT_COLLECTION_ID}?q=*&${fqs}`;
    return url;
  }

  ngOnInit() {
    this.url = this.setUrl();
  }
}
