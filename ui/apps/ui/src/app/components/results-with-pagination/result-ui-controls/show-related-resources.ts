import { Component, Input, OnInit } from '@angular/core';
import { DEFAULT_COLLECTION_ID } from '@collections/data';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';

@Component({
  selector: 'ess-related-resources',
  template: `
    <a style="display: flex;" [attr.href]="url">
      <span class="show-resources-icon"></span>
      <span class="show-resources-text">{{ this.label }}</span>
    </a>
  `,
  styleUrls: ['./show-related-resources.scss'],
})
export class ShowRelatedResourceComponent implements OnInit {
  @Input() public title = '';
  @Input() public pid = '';
  @Input() public collection: string = '';
  public url = '';
  public label: string = '';

  setUrl(): string {
    const fqDict: { [key: string]: string } = {
      provider: `fq=providers:"${this.title}"&fq=resource_organisation:"${this.title}"`,

      organisation: `fq=related_organisation_titles:"${this.title}"`,
      catalogue: `fq=catalogue:"${this.pid}"`,
    };
    const fqs = fqDict[this.collection];
    const url = `${SEARCH_PAGE_PATH}/${DEFAULT_COLLECTION_ID}?q=*&${fqs}`;

    return url;
  }

  ngOnInit() {
    this.url = this.setUrl();
    this.label = 'Show Resources';
  }
}
