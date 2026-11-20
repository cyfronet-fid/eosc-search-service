import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { WINDOW } from '../../app.providers';

import { RedirectService } from './redirect.service';

const paramsOf = (link: string | null): Record<string, string> =>
  Object.fromEntries(new URL(link ?? '', 'http://localhost/').searchParams);

describe('RedirectService', () => {
  let service: RedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideRouter([]), { provide: WINDOW, useValue: window }],
    });
    service = TestBed.inject(RedirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('internalUrl', () => {
    const target = 'https://marketplace.example.org/services/eosc.cyf.abc';

    it('adds the event name as event_name', () => {
      const link = service.internalUrl(
        target,
        '42',
        'service',
        '',
        false,
        'eosc.cyf.abc'
      );

      expect(paramsOf(link)['event_name']).toBe('eosc.cyf.abc');
    });

    it('leaves the other parameters unchanged', () => {
      const withoutName = service.internalUrl(
        target,
        '42',
        'service',
        '',
        true
      );
      const withName = service.internalUrl(
        target,
        '42',
        'service',
        '',
        true,
        'eosc.cyf.abc'
      );

      const { event_name, ...rest } = paramsOf(withName);
      expect(event_name).toBe('eosc.cyf.abc');
      expect(rest).toEqual(paramsOf(withoutName));
      expect(rest).toMatchObject({
        resource_id: '42',
        resource_type: 'service',
        recommendation: 'true',
      });
    });

    it('adds no event_name when there is no event name', () => {
      const link = service.internalUrl(target, '42', 'service', '');

      expect(paramsOf(link)).not.toHaveProperty('event_name');
    });

    it('keeps the offer fragment after the query string', () => {
      const link = service.internalUrl(
        target,
        '42',
        'bundle',
        '#offer-7',
        false,
        '12:3'
      );

      expect(link).toMatch(/\?.*event_name=12%3A3.*#offer-7$/);
    });
  });
});
