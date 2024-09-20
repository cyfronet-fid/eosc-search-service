import { Component, Input } from '@angular/core';
import { RelatedService } from '@collections/repositories/types';
import { DEFAULT_COLLECTION_ID } from '@collections/data';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'ess-ig-services-card',
  templateUrl: './ig-services-card.component.html',
  styleUrls: ['./ig-services-card.component.scss'],
})
export class IgServicesCardComponent {
  @Input() relatedServices: RelatedService[] | undefined = [];
  @Input() title = '';

  openService(pid: string) {
    const url = `${ConfigService.config?.eu_marketplace_url}/services/${pid}`;
    window.open(url);
  }
  showAll(): void {
    const fqs = `fq=guidelines:"${this.title}"`;
    const url = `${SEARCH_PAGE_PATH}/${DEFAULT_COLLECTION_ID}?q=*&${fqs}`;
    window.open(url);
  }
}
