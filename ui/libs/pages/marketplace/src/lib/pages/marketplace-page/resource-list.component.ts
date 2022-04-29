/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-resource-list',
  template: `
    <section id="dashboard__recommended-resources">
      <p>
        <b>Recommended resources</b>
        &nbsp;&nbsp;
        <span class="text-secondary">Browse recommended resources (20)</span>
      </p>
      <ess-resource
        *ngFor="let resource of resources"
        [resource]="resource"
      ></ess-resource>
    </section>
  `,
})
export class ResourceListComponent {
  @Input()
  resources!: any[] | null;
}
