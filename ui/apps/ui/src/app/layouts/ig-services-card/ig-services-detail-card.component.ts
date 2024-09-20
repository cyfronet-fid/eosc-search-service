import { Component, Input } from '@angular/core';
import { RelatedService } from '@collections/repositories/types';
import { AccessRight } from '@collections/repositories/types';
import { DEFAULT_COLLECTION_ID } from '@collections/data';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'ess-ig-services-detail-card',
  templateUrl: './ig-services-detail-card.component.html',
  styleUrls: ['./ig-services-detail-card.component.scss'],
})
export class IgServicesDetailCardComponent {
  @Input() relatedServices: RelatedService[] | undefined = [];
  @Input() marketplaceUrl = '';
  @Input() title = '';

  _getAccessIcon(accessRight: AccessRight) {
    const iconMapping: Record<AccessRight, string> = {
      'open access': '/assets/access-icons/open-access.svg',
      embargo: '/assets/access-icons/embargo-access.svg',
      closed: '/assets/access-icons/closed-access.svg',
      'order required': '/assets/access-icons/order-required-access.svg',
      restricted: '/assets/access-icons/restricted-access.svg',
      other: '/assets/access-icons/other-access.svg',
    };

    return accessRight in iconMapping
      ? iconMapping[accessRight]
      : iconMapping['other'];
  }

  openService(pid: string) {
    const url = `${ConfigService.config?.eu_marketplace_url}/services/${pid}`;
    window.open(url);
  }

  showAll(): void {
    const fqs = `fq=guidelines:"${this.title}"`;
    const url = `${SEARCH_PAGE_PATH}/${DEFAULT_COLLECTION_ID}?q=*&${fqs}`;
    window.open(url);
  }

  setLogoUrl(logoUrl: string, type: string): string {
    const defaultLogoMapper: Record<string, string> = {
      'data source': 'assets/icon-type-data-source.svg',
      service: 'assets/icon-type-service.svg',
    };

    if (this.imageExists(logoUrl)) {
      return logoUrl;
    } else {
      return defaultLogoMapper[type];
    }
  }

  imageExists(logoUrl: string): boolean {
    const img = new Image();
    img.src = logoUrl;

    if (img.complete) {
      return true;
    } else {
      img.onload = () => {
        return true;
      };
      return false;
    }
  }
}
