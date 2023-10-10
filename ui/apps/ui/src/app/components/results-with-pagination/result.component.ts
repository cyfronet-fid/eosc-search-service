import { Component, Input, OnInit } from '@angular/core';
import {
  AccessRight,
  IColoredTag,
  ISecondaryTag,
  ITag,
  IValueWithLabel,
} from '@collections/repositories/types';
import { CustomRoute } from '@collections/services/custom-route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { toArray } from '@collections/filters-serializers/utils';
import { RedirectService } from '@collections/services/redirect.service';
import { environment } from '@environment/environment';
import { COLLECTION } from '@collections/data/services/search-metadata.data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IService } from '@collections/data/services/service.model';
import { IOffer } from '@collections/data/bundles/bundle.model';
import isArray from 'lodash-es/isArray';

@Component({
  selector: 'ess-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  q$ = this._customRoute.q$;
  tagsq: string[] = [];
  validUrl: string | null = null;
  highlightsreal: { [field: string]: string[] | undefined } = {};

  @Input() id!: string;
  @Input() date?: string;
  @Input() urls: string[] = [];

  @Input() isResearchProduct = false;
  @Input() description!: string;

  @Input() abbreviation!: string;

  @Input() title!: string;

  @Input() offers: IOffer[] = [];
  @Input() providerName?: string;

  @Input()
  set url(url: string) {
    if (url && url.trim() !== '') {
      this.validUrl = url;
      return;
    }
  }

  @Input() orderUrl?: string;

  get redirectUrl(): string | null {
    if (this.validUrl == null || this.validUrl === '') {
      return null;
    }
    if (this.type.value === 'bundle') {
      this.redirectService.internalUrl(
        this.validUrl,
        this.id,
        this.type.value,
        this.offers[0]?.main_offer_id
          ? '#offer-' + this.offers[0].main_offer_id.toString().substring(2)
          : ''
      );
    }
    return this.redirectService.internalUrl(
      this.validUrl,
      this.id,
      this.type.value,
      ''
    );
  }

  get redirectOrderUrl(): string | null {
    if (this.orderUrl == null || this.orderUrl === '') {
      return null;
    }
    if (this.type.value === 'bundle') {
      this.redirectService.internalUrl(
        this.orderUrl,
        this.id,
        this.type.value,
        this.offers[0]?.main_offer_id
          ? '#offer-' + this.offers[0].main_offer_id.toString().substring(2)
          : ''
      );
    }
    return this.redirectService.internalUrl(
      this.orderUrl,
      this.id,
      this.type.value,
      ''
    );
  }

  @Input()
  type!: IValueWithLabel;

  @Input()
  tags: ITag[] = [];

  @Input()
  coloredTags: IColoredTag[] = [];

  @Input()
  languages: string[] = [];

  @Input()
  license?: string | string[];

  @Input()
  downloads?: number;

  @Input()
  views?: number;

  @Input()
  accessRight?: AccessRight;

  @Input()
  documentType?: string[];

  @Input()
  horizontal?: boolean;

  @Input()
  secondaryTags: ISecondaryTag[] = [];

  @Input()
  resourceType!: string;

  @Input()
  set highlights(highlights: { [field: string]: string[] | undefined }) {
    this.highlightsreal = highlights;
    return;
  }
  public hasDOIUrl = false;
  public parsedUrls: { [key: string]: string } = {};

  public readonly RESOURCES_TO_SHOW_PIN_TO: string[] = [
    'software',
    'publication',
    'dataset',
    'other',
  ];

  public readonly MP_RESOURCES_TO_SHOW_PIN_TO: string[] = [
    'data-source',
    'service',
    'bundle',
  ];

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    public redirectService: RedirectService,
    private _http: HttpClient,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.parseUrls();
    const tgs = this._route.snapshot.queryParamMap.getAll('tags');
    if (typeof tgs === 'string') {
      this.tagsq.push(tgs);
    } else if (tgs) {
      tgs.forEach((el) => this.tagsq.push(el));
    }

    for (const tag of this.tagsq) {
      if (tag.startsWith('author:')) {
        const aut = tag.split(':', 2)[1].trim();
        const splitted = aut.split(' ');
        const query_param: string[] = [];
        splitted.forEach((el: string) => {
          if (el.trim() !== '') {
            query_param.push(el.trim());
          }
        });

        query_param.forEach((el: string) => {
          if (this.highlightsreal['author_names_tg'] === undefined) {
            this.highlightsreal['author_names_tg'] = [];
            this.highlightsreal['author_names_tg'].push('<em>' + el + '</em>');
          } else {
            this.highlightsreal['author_names_tg'].push('<em>' + el + '</em>');
          }
        });
      }

      if (tag.startsWith('exact:')) {
        if (this.highlightsreal['author_names_tg'] === undefined) {
          this.highlightsreal['author_names_tg'] = [];
          this.highlightsreal['author_names_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        } else {
          this.highlightsreal['author_names_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        }

        if (this.highlightsreal['description'] === undefined) {
          this.highlightsreal['description'] = [];
          this.highlightsreal['description'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        } else {
          this.highlightsreal['description'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        }

        if (this.highlightsreal['keywords_tg'] === undefined) {
          this.highlightsreal['keywords_tg'] = [];
          this.highlightsreal['keywords_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        } else {
          this.highlightsreal['keywords_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        }

        if (this.highlightsreal['tag_list_tg'] === undefined) {
          this.highlightsreal['tag_list_tg'] = [];
          this.highlightsreal['tag_list_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        } else {
          this.highlightsreal['tag_list_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        }

        if (this.highlightsreal['title'] === undefined) {
          this.highlightsreal['title'] = [];
          this.highlightsreal['title'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        } else {
          this.highlightsreal['title'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        }
      }

      if (tag.startsWith('in title:')) {
        if (this.highlightsreal['title'] === undefined) {
          this.highlightsreal['title'] = [];
          this.highlightsreal['title'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        } else {
          this.highlightsreal['title'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        }
      }

      if (tag.startsWith('keyword:')) {
        if (this.highlightsreal['keywords_tg'] === undefined) {
          this.highlightsreal['keywords_tg'] = [];
          this.highlightsreal['keywords_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        } else {
          this.highlightsreal['keywords_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        }
      }

      if (tag.startsWith('tagged:')) {
        if (this.highlightsreal['tag_list_tg'] === undefined) {
          this.highlightsreal['tag_list_tg'] = [];
          this.highlightsreal['tag_list_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        } else {
          this.highlightsreal['tag_list_tg'].push(
            '<em>' + tag.split(':', 2)[1].trim() + '</em>'
          );
        }
      }
    }
    const highlightsreal_title = [...new Set(this.highlightsreal['title'])];
    const highlightsreal_an = [
      ...new Set(this.highlightsreal['author_names_tg']),
    ];
    const highlightsreal_desc = [
      ...new Set(this.highlightsreal['description']),
    ];
    const highlightsreal_key = [...new Set(this.highlightsreal['keywords_tg'])];
    const highlightsreal_tl = [...new Set(this.highlightsreal['tag_list_tg'])];

    this.highlightsreal['title'] = highlightsreal_title.reverse();
    this.highlightsreal['author_names_tg'] = highlightsreal_an.reverse();
    this.highlightsreal['description'] = highlightsreal_desc.reverse();
    this.highlightsreal['keywords_tg'] = highlightsreal_key.reverse();
    this.highlightsreal['tag_list_tg'] = highlightsreal_tl.reverse();
  }

  parseUrls() {
    this.urls.map((url) => {
      const doi = this.extractDOIFromUrl(url);
      this.parsedUrls[url] = doi;
      if (doi !== '') {
        this.hasDOIUrl = true;
      }
    });
  }

  extractDOIFromUrl(url: string) {
    const searchTerm = 'doi.org/';
    const index = url.search(searchTerm);
    if (index === -1) {
      return '';
    } else {
      const doi = url.slice(index + searchTerm.length);
      const httpIndex = doi.search('http');
      if (httpIndex > -1) {
        return '';
      } else {
        return doi;
      }
    }
  }

  get$(id: number | string): Observable<IService> {
    const endpointUrl = `/${environment.backendApiPath}/${COLLECTION}`;
    return this._http.get<IService>(`${endpointUrl}/${id}`);
  }

  async setActiveFilter(filter: string, value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: this._addFilter(filter, value),
      },
      queryParamsHandling: 'merge',
    });
  }

  _addFilter(filter: string, value: string): string[] {
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    const fqMap = this._customRoute.fqMap();
    if (toArray(fqMap[filter]).includes(value)) {
      return deserializeAll(fqMap, filtersConfigs);
    }

    return deserializeAll(
      {
        ...this._customRoute.fqMap(),
        [filter]: [...toArray(this._customRoute.fqMap()[filter]), value],
      },
      filtersConfigs
    );
  }

  _createDocumentTypeLabel(type: string, documentType: string[] | undefined) {
    const removeDuplicates = (documentType: string[]): string[] => [
      ...new Set(documentType),
    ];

    const getHumanReadableType = (type: string): string => {
      const humanReadableDict: { [key: string]: string } = {
        publication: 'Publication',
        dataset: 'Data',
        software: 'Software',
        service: 'Service',
        bundles: 'Service Bundle',
        training: 'Training',
        other: 'Other Research Product',
        provider: 'Provider',
        'data source': 'Data Source',
        'interoperability guideline': 'Interoperability Guideline',
      };
      return type in humanReadableDict
        ? humanReadableDict[type]
        : humanReadableDict['other'];
    };

    return documentType && documentType.length > 0
      ? `${getHumanReadableType(type)}: ${removeDuplicates(documentType).join(
          ' / '
        )}`
      : `${getHumanReadableType(type)}`;
  }

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

  _formatLicense(license: string | string[]) {
    return isArray(license) ? license.join(', ') : license;
  }
}
