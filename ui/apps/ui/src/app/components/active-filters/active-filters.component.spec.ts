import { Router } from '@angular/router';
import { IFilterConfig } from '@collections/repositories/types';
import { CustomRoute } from '@collections/services/custom-route.service';
import { ICustomRouteProps } from '@collections/services/custom-route.type';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { FiltersConfigsRepository } from '../../collections/repositories/filters-configs.repository';
import { ActiveFiltersComponent } from './active-filters.component';

describe('ActiveFiltersComponent', () => {
  let component: ActiveFiltersComponent;
  let params$: BehaviorSubject<ICustomRouteProps>;
  let customRoute: {
    params$: BehaviorSubject<ICustomRouteProps>;
    fqMap: jest.Mock;
    fqWithExcludedFilter: jest.Mock;
    collection: jest.Mock;
  };
  let router: { navigate: jest.Mock };
  let filtersConfigsRepository: { get: jest.Mock };

  const providerFilter: IFilterConfig = {
    id: 'providers',
    filter: 'providers',
    label: 'Provider',
    type: 'multiselect',
    defaultCollapsed: false,
    tooltipText: '',
  };

  const params = (
    overrides: Partial<ICustomRouteProps> = {}
  ): ICustomRouteProps =>
    ({
      collection: 'service',
      q: '*',
      sort_ui: 'default',
      fq: ['pid:("service-1")'],
      cursor: '*',
      sort: [],
      standard: 'true',
      exact: 'false',
      tags: [],
      radioValueAuthor: 'A',
      radioValueExact: 'A',
      radioValueTitle: 'A',
      radioValueKeyword: 'A',
      guideline: 'Guideline title',
      ...overrides,
    } as ICustomRouteProps);

  beforeEach(() => {
    params$ = new BehaviorSubject(params());
    customRoute = {
      params$,
      fqMap: jest.fn().mockReturnValue({}),
      fqWithExcludedFilter: jest
        .fn()
        .mockReturnValue(['providers:("Organisation")']),
      collection: jest.fn().mockReturnValue('service'),
    };
    router = { navigate: jest.fn().mockResolvedValue(true) };
    filtersConfigsRepository = {
      get: jest.fn().mockReturnValue({ filters: [providerFilter] }),
    };

    component = new ActiveFiltersComponent(
      customRoute as unknown as CustomRoute,
      router as unknown as Router,
      filtersConfigsRepository as unknown as FiltersConfigsRepository
    );
  });

  it('adds a guideline filter for a PID-filtered service search', async () => {
    await expect(firstValueFrom(component.activeFilters$)).resolves.toEqual([
      {
        filter: 'guideline-context',
        label: 'Guideline',
        uiValue: 'Guideline title',
        value: 'Guideline title',
      },
    ]);
  });

  it.each([
    ['a different collection', { collection: 'dataset' }],
    ['a blank guideline title', { guideline: '   ' }],
    ['no PID filter', { fq: ['providers:("Organisation")'] }],
  ])('does not add a guideline filter for %s', async (_, overrides) => {
    params$.next(params(overrides));

    await expect(firstValueFrom(component.activeFilters$)).resolves.toEqual([]);
  });

  it('removes the guideline context and PID filters together', async () => {
    await component.removeFilter('guideline-context', 'Guideline title');

    expect(customRoute.fqWithExcludedFilter).toHaveBeenCalledWith('pid:');
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        fq: ['providers:("Organisation")'],
        guideline: null,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('clears the guideline context with all filters', async () => {
    await component.clearAll();

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { fq: [], guideline: null },
      queryParamsHandling: 'merge',
    });
  });

  it('continues to remove ordinary filters', async () => {
    customRoute.fqMap.mockReturnValue({
      providers: ['Organisation', 'Another organisation'],
    });

    await component.removeFilter('providers', 'Organisation');

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { fq: ['providers:("Another organisation")'] },
      queryParamsHandling: 'merge',
    });
  });
});
