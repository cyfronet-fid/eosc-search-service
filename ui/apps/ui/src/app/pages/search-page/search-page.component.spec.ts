import { of } from 'rxjs';
import { IResult, RelatedService } from '@collections/repositories/types';

import { SearchPageComponent } from './search-page.component';

describe('SearchPageComponent', () => {
  const results = [{ id: 'guideline-1' }, { id: 'guideline-2' }] as IResult[];
  const relatedServices = {
    'guideline-1': [{ pid: 'service-1' } as RelatedService],
  };

  const createComponent = (collection: string) => {
    const customRoute = {
      params: jest.fn().mockReturnValue({ collection }),
    };
    const fetchDataService = {
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
      {} as never,
      fetchDataService as never,
      {} as never,
      {} as never,
      {} as never,
      configService as never,
      paginationRepository as never
    );

    return { component, fetchDataService, paginationRepository };
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
});
