import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ess-pin-static',
  template: `
    <a style="display: flex;" [attr.href]="url" target="_blank">
      <span class="pin-icon"></span>
      <span class="pin-icon-text">Pin to the Marketplace Project</span>
    </a>
  `,
  styleUrls: ['./pin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinStaticComponent {
  @Input() public url = '';
}
