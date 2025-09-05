import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-repository',
  template: `
    <div *ngIf="repository">
      <a [href]="repository" target="_blank" class="link-repository">
        <img
          src="/assets/icon-website.svg"
          alt="Repository"
          class="repository-icon"
        />
        <span class="repository-label">{{ title || 'Repository' }}</span>
      </a>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .link-repository {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #040f81;
        font-size: 14px;
        font-weight: 500;
      }

      .repository-icon {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }

      .repository-label {
        line-height: 18px;
      }
    `,
  ],
})
export class RepositoryComponent {
  @Input() title: string = '';
  @Input() repository?: string;
}
