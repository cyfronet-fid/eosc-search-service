import { firstValueFrom } from 'rxjs';
import { IResult, RelatedService } from '@collections/repositories/types';

import { PaginationRepository } from './pagination.repository';

describe('PaginationRepository', () => {
  let repository: PaginationRepository;

  const guideline = (id: string) =>
    ({
      id,
      title: id,
      relatedServices: [],
    } as unknown as IResult);

  const relatedService = {
    pid: 'service-1',
    title: 'Service one',
  } as RelatedService;

  beforeEach(() => {
    repository = new PaginationRepository();
    repository.initialize({
      results: [guideline('guideline-1'), guideline('guideline-2')],
      numFound: 2,
      nextCursorMark: 'next',
      facets: {},
      highlighting: {},
    });
  });

  it('updates related services only for matching guideline results', async () => {
    repository.updateRelatedServices({
      'guideline-1': [relatedService],
      'missing-guideline': [relatedService],
    });

    const results = await firstValueFrom(repository.currentPageEntities$);

    expect(results).toEqual([
      { ...guideline('guideline-1'), relatedServices: [relatedService] },
      guideline('guideline-2'),
    ]);
  });

  it('does not change results for an empty related-services map', async () => {
    const resultsBefore = await firstValueFrom(repository.currentPageEntities$);

    repository.updateRelatedServices({});

    const resultsAfter = await firstValueFrom(repository.currentPageEntities$);
    expect(resultsAfter).toEqual(resultsBefore);
  });
});
