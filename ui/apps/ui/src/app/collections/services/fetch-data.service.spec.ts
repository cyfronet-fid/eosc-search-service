import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RelatedService } from '@collections/repositories/types';

import { FetchDataService } from './fetch-data.service';

describe('FetchDataService', () => {
  let service: FetchDataService;
  let httpController: HttpTestingController;
  const guidelineRelatedServicesUrl =
    '/api/web/related-resources/guideline-services';

  const relatedService = {
    pid: 'service-1',
    title: 'Service one',
  } as RelatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FetchDataService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('fetches and unwraps related services for guidelines', () => {
    let result: Record<string, RelatedService[]> | undefined;

    service
      .fetchGuidelineRelatedServices$(['guideline-1', 'guideline-2'])
      .subscribe((relatedServices) => (result = relatedServices));

    const request = httpController.expectOne(guidelineRelatedServicesUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      guideline_ids: ['guideline-1', 'guideline-2'],
    });
    request.flush({
      related_services: { 'guideline-1': [relatedService] },
    });

    expect(result).toEqual({ 'guideline-1': [relatedService] });
  });

  it('returns an empty map without sending a request for empty ids', () => {
    let result: Record<string, RelatedService[]> | undefined;

    service
      .fetchGuidelineRelatedServices$([])
      .subscribe((relatedServices) => (result = relatedServices));

    expect(result).toEqual({});
    httpController.expectNone(guidelineRelatedServicesUrl);
  });

  it('returns an empty map when related services cannot be fetched', () => {
    let result: Record<string, RelatedService[]> | undefined;

    service
      .fetchGuidelineRelatedServices$(['guideline-1'])
      .subscribe((relatedServices) => (result = relatedServices));

    httpController
      .expectOne(guidelineRelatedServicesUrl)
      .flush('Unavailable', { status: 503, statusText: 'Unavailable' });

    expect(result).toEqual({});
  });
});
