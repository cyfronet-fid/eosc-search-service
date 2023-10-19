import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-sources',
  templateUrl: './sources.component.html',
  styles: [
    `
      .sources-label-text {
        color: #040f81;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 18px;
      }
    `,
  ],
})
export class SourcesComponent {
  @Input() urls: string[] = [];
}
