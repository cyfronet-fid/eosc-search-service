import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import { ISecondaryTag } from '@collections/repositories/types';
import { combineHighlightsWith } from './utils';

@Component({
  selector: 'ess-secondary-tags',
  template: `
    <div class="usage secondary-tags">
      <div *ngIf="checkTagsWithValues()" style="margin-bottom: 0.7rem;"></div>

      <ng-container *ngFor="let tag of parsedTags; let i = index; trackBy: identityTagTrack">
        <ng-container [ngSwitch]="tag.type">
          <ng-container *ngSwitchCase="'url'">
            <div *ngIf="tag.values.length > 0" class="statistic text-muted">
              <div class="tag-label">
                <ng-container *ngIf="tag.iconPath">
                  <img [src]="tag.iconPath" alt="" />
                </ng-container>

                <ng-container *ngIf="tag.label">
                  <span class="label-text">{{ tag.label }}</span>
                </ng-container>
              </div>

              <div
                class="tag-values"
                [class.expanded]="expandedTags[i]"
                [class.collapsed]="!expandedTags[i]"
              >
                <ng-container *ngFor="let keyword of tag.values">
                  <a
                    class="tag-link"
                    href="javascript:void(0)"
                    (click)="setActiveFilter($any(tag.filter), keyword.value)"
                    [innerHTML]="keyword.label"
                  ></a>
                </ng-container>
              </div>

              <button
                *ngIf="shouldShowToggle(tag)"
                type="button"
                class="tag-toggle"
                (click)="toggleTags(i)"
              >
                <span>{{ expandedTags[i] ? 'Show less' : 'Show more' }}</span>

                <svg
                  class="tag-toggle-icon"
                  [class.rotated]="expandedTags[i]"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </ng-container>

          <ng-container *ngSwitchCase="'info'">
            <div *ngIf="tag.values.length > 0" class="statistic text-muted">
              <ng-container *ngIf="tag.iconPath">
                <img [src]="tag.iconPath" alt="" />
              </ng-container>

              <ng-container *ngIf="tag.label">
                <span class="label-text">{{ tag.label }}</span>
              </ng-container>

              <ng-container i18n *ngFor="let keyword of tag.values">
                {{ keyword }}&nbsp;&nbsp;
              </ng-container>
            </div>
          </ng-container>
        </ng-container>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .usage > .statistic {
        font-size: 11px;
        display: block;
        overflow: hidden;
        line-height: 1.7;
        margin-bottom: 8px;
      }

      .statistic > img {
        display: inline;
        float: left;
        margin-right: 10px;
        margin-top: 5px;
      }

      .label-text {
        color: black;
        display: inline;
        float: left;
        margin-right: 10px;
      }

      .tag-label {
        overflow: hidden;
      }

      .tag-values {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0 12px;
        width: 100%;
        overflow: hidden;
        line-height: 1.7;
      }

      .tag-values.collapsed {
        max-height: 1.7em;
      }

      .tag-values.expanded {
        max-height: none;
      }

      .tag-link {
        display: inline-block;
        text-decoration: none;
        cursor: pointer;
        white-space: nowrap;
      }

      .tag-toggle {
        margin-top: 6px;
        padding: 0;
        border: 0;
        background: transparent;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        font-size: 11px;
        line-height: 1.2;
        color: #1f3c88;
      }

      .tag-toggle-icon {
        transition: transform 0.25s ease;
      }

      .tag-toggle-icon.rotated {
        transform: rotate(180deg);
      }

      ::ng-deep .highlighted {
        background-color: #e8e7ff !important;
        padding: 0px;
      }
    `,
  ],
})
export class SecondaryTagsComponent implements OnChanges {
  parsedTags: ISecondaryTag[] = [];
  expandedTags: boolean[] = [];

  @Input()
  tags: ISecondaryTag[] = [];

  @Input()
  highlights: { [field: string]: string[] | undefined } = {};

  @Output()
  activeFilter = new EventEmitter<{ filter: string; value: string }>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tags'] || changes['highlights']) {
      this.parsedTags = combineHighlightsWith(this.tags, this.highlights);
      this.expandedTags = [];
    }
  }

  identityTagTrack: TrackByFunction<ISecondaryTag> = (
    index: number,
    tag: ISecondaryTag
  ) => tag;

  setActiveFilter(filter: string, value: string): void {
    this.activeFilter.emit({ filter, value });
  }

  checkTagsWithValues(): boolean {
    return !!(
      this.parsedTags && this.parsedTags.some((tag) => tag.values.length > 0)
    );
  }

  toggleTags(index: number): void {
    this.expandedTags[index] = !this.expandedTags[index];
  }

  shouldShowToggle(tag: ISecondaryTag): boolean {
    return tag.type === 'url' && Array.isArray(tag.values) && tag.values.length > 4;
  }
}
