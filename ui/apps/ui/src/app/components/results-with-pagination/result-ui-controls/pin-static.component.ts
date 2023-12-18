import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ess-pin-static',
  template: `
    <a style="display: flex;" [attr.href]="url" target="_blank">
      <span class="pin-icon"></span>
      <span class="pin-icon-text">Access the {{ typeLabel }}</span>
    </a>
  `,
  styleUrls: ['./pin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinStaticComponent {
  @Input() public url = '';
  public typeLabel: string | null = null;
  @Input() public set type(value: string) {
    switch (value) {
      case 'bundle': {
        this.typeLabel = 'Bundle';
        break;
      }
      case 'data-source': {
        this.typeLabel = 'Data Source';
        break;
      }
      case 'service': {
        this.typeLabel = 'Service';
        break;
      }
      default: {
        this.typeLabel = 'Marketplace Project';
        break;
      }
    }
  }
}
