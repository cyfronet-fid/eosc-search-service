import { Component, Input } from '@angular/core';
import { RelatedService } from '@collections/repositories/types';
import { buildRelatedServicesLink } from '@collections/data/guidelines/related-services-link.utils';
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
    const url = `${ConfigService.config?.marketplace_url}/services/${pid}`;
    window.open(url);
  }
  showAll(): void {
    const url = buildRelatedServicesLink(
      this.relatedServices?.map(({ pid }) => pid) ?? [],
      this.title
    );

    if (url) {
      window.open(url);
    }
  }
}
