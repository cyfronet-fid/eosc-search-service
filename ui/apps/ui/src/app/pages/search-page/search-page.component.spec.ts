import { CommonModule } from '@angular/common';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, Subject, of } from 'rxjs';
import {
  IResult,
  ISearchResults,
  RelatedService,
} from '@collections/repositories/types';

import { SearchPageComponent } from './search-page.component';
import { CustomRoute } from '@collections/services/custom-route.service';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { AdaptersRepository } from '@collections/repositories/adapters.repository';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { PaginationRepository } from '@components/results-with-pagination/pagination.repository';
import { ResultsWithPaginationComponent } from '@components/results-with-pagination/results-with-pagination.component';
import { ResultComponent } from '@components/results-with-pagination/result.component';
import { RedirectService } from '@collections/services/redirect.service';
import { ConfigService } from '../../services/config.service';
import { IgServicesCardComponent } from '../../layouts/ig-services-card/ig-services-card.component';
import { UrlTitleModule } from '../../layouts/url-title/url-title.module';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';

jest.mock('string-strip-html', () => ({
  stripHtml: (value: string) => ({ result: value }),
}));

describe('SearchPageComponent', () => {
  const results = [{ id: 'guideline-1' }, { id: 'guideline-2' }] as IResult[];
  const relatedServices = {
    'guideline-1': [{ pid: 'service-1' } as RelatedService],
  };

  const createComponent = (collection: string) => {
    const queryParamMap$ = new BehaviorSubject(
      convertToParamMap({ cursor: '*' })
    );
    const customRoute = {
      params: jest.fn().mockReturnValue({ collection }),
      _updateParamsBy: jest.fn().mockImplementation(() => ({
        collection,
        cursor: queryParamMap$.value.get('cursor'),
        standard: 'true',
        q: '*',
        fq: [],
        exact: 'false',
      })),
      fetchFilters$: jest.fn().mockReturnValue(of({})),
    };
    const fetchDataService = {
      fetchResults$: jest.fn(),
      fetchGuidelineRelatedServices$: jest
        .fn()
        .mockReturnValue(of(relatedServices)),
    };
    const paginationRepository = {
      updateRelatedServices: jest.fn(),
    };
    const configService = {
      get: jest.fn().mockReturnValue({
        knowledge_hub_url: '',
        marketplace_url: '',
        user_documentation_url: '',
      }),
    };

    const component = new SearchPageComponent(
      customRoute as never,
      {} as never,
      {
        paramMap: of(convertToParamMap({ collection })),
        queryParamMap: queryParamMap$.asObservable(),
      } as never,
      fetchDataService as never,
      {
        get: jest.fn().mockReturnValue({
          params: { collection, qf: 'title' },
          facets: {},
        }),
      } as never,
      {
        get: jest.fn().mockReturnValue({ adapter: (item: IResult) => item }),
      } as never,
      {} as never,
      configService as never,
      paginationRepository as never
    );

    return {
      component,
      fetchDataService,
      paginationRepository,
      queryParamMap$,
    };
  };

  it('loads related services after guideline results', () => {
    const { component, fetchDataService, paginationRepository } =
      createComponent('guideline');

    component['_loadGuidelineRelatedServices'](results);

    expect(
      fetchDataService.fetchGuidelineRelatedServices$
    ).toHaveBeenCalledWith(['guideline-1', 'guideline-2']);
    expect(paginationRepository.updateRelatedServices).toHaveBeenCalledWith(
      relatedServices
    );
  });

  it('does not load related services for another collection', () => {
    const { component, fetchDataService, paginationRepository } =
      createComponent('service');

    component['_loadGuidelineRelatedServices'](results);

    expect(
      fetchDataService.fetchGuidelineRelatedServices$
    ).not.toHaveBeenCalled();
    expect(paginationRepository.updateRelatedServices).not.toHaveBeenCalled();
  });

  it('enriches subsequent guideline pages when the cursor changes', () => {
    const {
      component,
      fetchDataService,
      paginationRepository,
      queryParamMap$,
    } = createComponent('guideline');
    const nextResults = [{ id: 'guideline-3' }] as IResult[];
    const response = (pageResults: IResult[], nextCursorMark: string) => ({
      results: pageResults,
      numFound: 3,
      nextCursorMark,
      facets: {},
      highlighting: {},
    });
    const firstPage$ = new Subject<ISearchResults<IResult>>();
    const nextPage$ = new Subject<ISearchResults<IResult>>();
    const firstEnrichment$ = new Subject<Record<string, RelatedService[]>>();
    const nextEnrichment$ = new Subject<Record<string, RelatedService[]>>();
    const nextRelatedServices = {
      'guideline-3': [{ pid: 'service-3' } as RelatedService],
    };
    fetchDataService.fetchResults$
      .mockReturnValueOnce(firstPage$)
      .mockReturnValueOnce(nextPage$);
    fetchDataService.fetchGuidelineRelatedServices$
      .mockReturnValueOnce(firstEnrichment$)
      .mockReturnValueOnce(nextEnrichment$);

    component.ngOnInit();
    try {
      const firstResponse = response(results, 'next');
      firstPage$.next(firstResponse);
      firstPage$.complete();

      expect(component.response).toEqual(firstResponse);
      expect(
        fetchDataService.fetchGuidelineRelatedServices$
      ).toHaveBeenNthCalledWith(1, ['guideline-1', 'guideline-2']);
      expect(paginationRepository.updateRelatedServices).not.toHaveBeenCalled();
      firstEnrichment$.next(relatedServices);
      firstEnrichment$.complete();

      queryParamMap$.next(convertToParamMap({ cursor: 'next' }));
      expect(fetchDataService.fetchResults$).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ cursor: 'next' }),
        {},
        expect.any(Function)
      );
      const nextResponse = response(nextResults, 'last');
      nextPage$.next(nextResponse);
      nextPage$.complete();

      expect(component.response).toEqual(nextResponse);
      expect(
        fetchDataService.fetchGuidelineRelatedServices$
      ).toHaveBeenNthCalledWith(2, ['guideline-3']);
      expect(paginationRepository.updateRelatedServices).toHaveBeenCalledTimes(
        1
      );
      nextEnrichment$.next(nextRelatedServices);
      nextEnrichment$.complete();

      expect(
        fetchDataService.fetchGuidelineRelatedServices$
      ).toHaveBeenCalledTimes(2);
      expect(
        paginationRepository.updateRelatedServices
      ).toHaveBeenNthCalledWith(1, relatedServices);
      expect(
        paginationRepository.updateRelatedServices
      ).toHaveBeenNthCalledWith(2, nextRelatedServices);
    } finally {
      component.ngOnDestroy();
    }
  });
});

describe('SearchPageComponent related-services UI', () => {
  let fixture: ComponentFixture<SearchPageComponent>;
  let httpController: HttpTestingController;
  let paginationRepository: PaginationRepository;
  const relatedServicesUrl = '/api/web/related-resources/guideline-services';
  const guideline: IResult = {
    id: 'guideline-1',
    title: 'Guideline one',
    description: '',
    type: { label: 'interoperability guideline', value: 'guideline' },
    collection: 'guideline',
    url: '/guidelines/guideline-1',
    tags: [],
    isResearchProduct: false,
    relatedServices: [],
  };

  beforeEach(async () => {
    const params = {
      collection: 'guideline',
      cursor: '*',
      standard: 'true',
      q: '*',
      fq: [],
      exact: 'false',
    };
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        UrlTitleModule,
        InteroperabilityGuidelinesPipeModule,
      ],
      declarations: [
        SearchPageComponent,
        ResultsWithPaginationComponent,
        ResultComponent,
        IgServicesCardComponent,
      ],
      providers: [
        {
          provide: CustomRoute,
          useValue: {
            params: () => params,
            _updateParamsBy: () => params,
            fetchFilters$: () => of({}),
            collection: () => 'guideline',
            cursor: () => '*',
            q$: of('*'),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ collection: 'guideline' })),
            queryParamMap: of(convertToParamMap({ cursor: '*' })),
            snapshot: { queryParamMap: convertToParamMap({}) },
          },
        },
        { provide: Router, useValue: { url: '/search/guideline' } },
        {
          provide: SearchMetadataRepository,
          useValue: {
            get: () => ({
              params: { collection: 'guideline', qf: 'title' },
              facets: {},
            }),
          },
        },
        {
          provide: AdaptersRepository,
          useValue: { get: () => ({ adapter: (item: IResult) => item }) },
        },
        { provide: FiltersConfigsRepository, useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            get: () => ({
              knowledge_hub_url: '',
              marketplace_url: '',
              user_documentation_url: '',
            }),
          },
        },
        {
          provide: RedirectService,
          useValue: { internalUrl: (url: string) => url },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
    paginationRepository = TestBed.inject(PaginationRepository);
    paginationRepository.clear();
    fixture = TestBed.createComponent(SearchPageComponent);
  });

  afterEach(() => {
    fixture.destroy();
    httpController.verify();
    paginationRepository.clear();
  });

  const renderSearchResults = () => {
    fixture.detectChanges();
    httpController
      .expectOne((request) => request.url === '/api/web/search-results')
      .flush({
        results: [guideline],
        numFound: 1,
        nextCursorMark: '*',
        facets: {},
        highlighting: {},
      });
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('ess-url-title')?.textContent).toContain(
      'Guideline one'
    );
    expect(element.querySelector('.related-services-box')).toBeNull();
    expect(element.querySelector('nz-skeleton')).toBeNull();
    expect(element.querySelector('nz-skeleton-element')).toBeNull();
    return element;
  };

  it('renders guidelines before enrichment and adds services after success', () => {
    const element = renderSearchResults();
    const resultCard = element.querySelector('ess-result');
    const request = httpController.expectOne(relatedServicesUrl);
    expect(request.request.body).toEqual({ guideline_ids: ['guideline-1'] });

    request.flush({
      related_services: {
        'guideline-1': [
          {
            pid: 'service-1',
            title: 'Service one',
            resource_organisation: 'EOSC',
            best_access_right: 'open',
            type: 'service',
          },
        ],
      },
    });
    fixture.detectChanges();

    expect(element.querySelector('ess-result')).toBe(resultCard);
    expect(element.querySelector('.service-title')?.textContent).toContain(
      'Service one'
    );
    expect(element.querySelector('ess-url-title')?.textContent).toContain(
      'Guideline one'
    );
    expect(element.querySelector('nz-skeleton')).toBeNull();
    expect(element.querySelector('nz-empty')).toBeNull();
  });

  it.each(['HTTP error', 'network timeout', 'Catalogue timeout fallback'])(
    'keeps rendered guidelines usable after %s',
    (failure) => {
      const element = renderSearchResults();
      const resultCard = element.querySelector('ess-result');
      const request = httpController.expectOne(relatedServicesUrl);

      if (failure === 'HTTP error') {
        request.flush('Unavailable', {
          status: 500,
          statusText: 'Internal Server Error',
        });
      } else if (failure === 'network timeout') {
        request.error(new ProgressEvent('timeout'));
      } else {
        request.flush({ related_services: { 'guideline-1': [] } });
      }
      fixture.detectChanges();

      expect(element.querySelector('ess-result')).toBe(resultCard);
      expect(
        element.querySelector('ess-url-title a')?.getAttribute('href')
      ).toBe('/guidelines/guideline-1');
      expect(element.querySelector('ess-url-title')?.textContent).toContain(
        'Guideline one'
      );
      expect(element.querySelector('.related-services-box')).toBeNull();
      expect(element.querySelector('nz-skeleton')).toBeNull();
      expect(element.querySelector('nz-skeleton-element')).toBeNull();
      expect(element.querySelector('nz-empty')).toBeNull();
      expect(element.querySelector('#results-count')?.textContent).toContain(
        '1 search results'
      );
    }
  );
});
