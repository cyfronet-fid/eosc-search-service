import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { CustomRoute } from '@collections/services/custom-route.service';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { RedirectService } from '@collections/services/redirect.service';

@Component({
  selector: 'ess-pin',
  template: `
    <a style="display: flex;" [attr.href]="pinUrl">
      <span class="pin-icon"></span>
      <span class="pin-icon-text">Pin to the Marketplace Project</span>
    </a>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-top: 4px;
      }

      .pin-icon {
        width: 18px;
        height: 18px;
        background-repeat: no-repeat;
        background-image: url('../../../../assets/pin-icon.svg');
      }

      .pin-icon-text {
        color: #040f81;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 18px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinComponent implements OnChanges {
  @Input() resourceId!: string;
  @Input() resourceType!: string;

  public pinUrl = '';

  constructor(
    private _configService: ConfigService,
    private _customRoute: CustomRoute,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _redirectService: RedirectService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { params } = this._searchMetadataRepository.get(
      this._customRoute.collection()
    );
    if (changes['resourceId'] || changes['resourceType']) {
      this.pinUrl =
        this._redirectService.internalUrl(
          `${
            this._configService.get().marketplace_url
          }/research_products/new?resource_id=${encodeURIComponent(
            this.resourceId
          )}&resource_type=${encodeURIComponent(params.collection)}`,
          this.resourceId,
          this.resourceType,
          ''
        ) ?? '';
    }
  }
}