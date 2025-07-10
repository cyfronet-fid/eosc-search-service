import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-package',
  template: `
    <div>
      <a href="javascript:void(0)" class="link-package">
        <img
          src="/assets/icon-website.svg"
          alt="Package"
          class="package-icon"
        />
        <span class="package-label">Package</span>
      </a>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .link-package {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #040f81;
        font-size: 14px;
        font-weight: 500;
      }

      .package-icon {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }

      .package-label {
        line-height: 18px;
      }
    `,
  ],
})
export class PackageComponent {
  @Input() title: string = '';
  @Input() urls: string[] = [];
}
