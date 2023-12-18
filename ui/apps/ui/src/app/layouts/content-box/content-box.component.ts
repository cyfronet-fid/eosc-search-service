import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import truncate from 'lodash-es/truncate';
import { attachHighlightsToTxt, stripHighlightedFromHtml } from '../utils';
import { stripHtml } from 'string-strip-html';

const MAX_CHARS_LENGTH = 256;

@Component({
  selector: 'ess-description',
  template: `
    <p class="description">
      <span [innerHTML]="showFull ? fullDescription : shortDescription"></span>
      <a
        *ngIf="hasShowMoreBtn && !buttonOff"
        href="javascript:void(0)"
        class="btn-show-more"
        (click)="showFull = !showFull"
        >Show {{ showFull ? 'less' : 'more' }}
      </a>
    </p>
  `,
  styles: [
    `
      ::ng-deep .highlighted {
        background-color: #e8e7ff !important;
        padding: 0px;
      }
    `,
  ],
})
export class ContentBoxComponent implements OnChanges {
  hasShowMoreBtn = false;
  showFull = false;

  shortDescription = '';
  fullDescription = '';

  @Input()
  description!: string;

  @Input()
  highlights: string[] = [];

  @Input()
  buttonOff!: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['description'] || changes['highlights']) {
      this.hasShowMoreBtn = this.description.length >= MAX_CHARS_LENGTH;
      const highlights = stripHighlightedFromHtml(this.highlights);
      const highlights_s = [...new Set(highlights)];
      const strippedDescription = stripHtml(this.description).result;
      const shortStrippedDescription = truncate(strippedDescription, {
        length: MAX_CHARS_LENGTH,
      });
      this.shortDescription = attachHighlightsToTxt(
        shortStrippedDescription,
        highlights_s
      );
      this.fullDescription = attachHighlightsToTxt(
        strippedDescription,
        highlights_s
      );
    }
  }
}
