import { Component, Input } from '@angular/core';
import { InstanceExportData } from '@collections/data/openair.model';

@Component({
  selector: 'ess-sources',
  templateUrl: './sources.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .sources-label-text {
        color: #040f81;
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
  @Input() exportData?: InstanceExportData[] = [];

  openLink(url: string) {
    window.open(url);
  }
}
