import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomRoute } from '@collections/services/custom-route.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ess-filter-label',
  template: `
    <div class="filter-title-container">
      <span class="filter-title">
        <b>{{ label }}</b>
      </span>
      <div id="tooltipIcon">
        <img
          src="assets/tooltip_prompt.svg"
          [ngbTooltip]="tooltipText"
          alt="Tooltip prompt icon"
          *ngIf="!!tooltipText"
          class="tooltip-prompt-icon"
        />
      </div>
      <div *ngIf="showClearButton">
        <span (click)="resetAllActiveEntities()" class="clear-button-span">
          <a href="javascript:void(0)" class="clear-button">Clear</a>
        </span>
      </div>
      <div class="expand-arrow" *ngIf="expandArrow">
        <button
          class="expand-collapse-button"
          [class.expanded]="isExpanded"
          [class.collapsed]="!isExpanded"
          (click)="toggleExpanded()"
        >
          <img src="assets/expand-arrow-1.svg" alt="Expand/Collapse Arrow" />
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .filter-title-container {
        display: flex;
        justify-content: flex-start;
      }
      .filter-title {
        padding-bottom: 6px;
        display: inline-block;
      }
      .expand-arrow {
        margin-left: auto;
      }
      .expand-collapse-button {
        border: none;
        background: none;
        cursor: pointer;
        margin: 6px 0 0 0;
        padding: 0;
      }
      .expand-collapse-button img {
        width: 1em;
        height: auto;
      }
      .expand-collapse-button.expanded img {
        transform: rotate(180deg);
        transition: transform 0.3s;
      }
      .expand-collapse-button.collapsed img {
        transition: transform 0.3s;
      }
      .tooltip-prompt-icon {
        margin: 11px 10px 0 10px;
        width: 1.12em;
      }
    `,
  ],
})
export class FilterLabelComponent {
  @Input()
  label!: string;

  @Input() filter!: string;

  @Input() isExpanded!: boolean;

  @Input() expandArrow: boolean | undefined;

  @Output() isExpandedChanged = new EventEmitter<boolean>();

  @Input() showClearButton = false;

  @Input() tooltipText!: string;

  constructor(private _customRoute: CustomRoute, private _router: Router) {}

  async resetAllActiveEntities() {
    await this._router.navigate([], {
      queryParams: {
        fq: this._customRoute.fq().filter((fq) => !fq.startsWith(this.filter)),
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.isExpandedChanged.emit(this.isExpanded);
  }
}
