import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RedirectService } from '@collections/services/redirect.service';
import { stripHtml } from 'string-strip-html';
import { attachHighlightsToTxt, stripHighlightedFromHtml } from '../utils';

@Component({
  selector: 'ess-url-title',
  template: `<h6>
    <a *ngIf="url; else onlyTitleRef" [attr.href]="url">
      <b [innerHTML]="highlightedTitle"></b>
    </a>
    <ng-template #onlyTitleRef
      ><b [innerHTML]="highlightedTitle"></b
    ></ng-template>
  </h6>`,
  styles: [
    `
      ::ng-deep .highlighted {
        background-color: #e8e7ff !important;
        padding: 0px;
      }
    `,
  ],
})
export class UrlTitleComponent implements OnChanges {
  highlightedTitle = '';

  @Input()
  title!: string;

  @Input()
  url: string | null = null;

  @Input()
  highlight: string[] = [];

  constructor(public redirectService: RedirectService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['highlight'] || changes['title']) {
      const highlights = stripHighlightedFromHtml(this.highlight);
      const highlights_s = [...new Set(highlights)];
      this.highlightedTitle = attachHighlightsToTxt(
        stripHtml(this.title).result,
        highlights_s
      );
    }
  }
}
