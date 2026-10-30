import { convertToParamMap } from '@angular/router';
import { BehaviorSubject, Subject, of } from 'rxjs';
import {
  IResult,
  ISearchResults,
  RelatedService,
} from '@collections/repositories/types';

import { SearchPageComponent } from './search-page.component';

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
