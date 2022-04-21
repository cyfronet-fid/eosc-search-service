/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-resources',
  template: `
    <section id="dashboard__recommended-resources">
      <p>
        <b>Recommended resources</b>
        &nbsp;&nbsp;
        <span class="text-secondary">Browse recommended resources (20)</span>
      </p>
      <ui-resource
        *ngFor="let resource of resources"
        [resource]="resource"
      ></ui-resource>
    </section>
  `,
})
export class ResourcesComponent {
  @Input()
  resources!: any[] | null;
}
