import { delay, Observable, tap } from 'rxjs';
import { EoscCommonWindow, UserProfile } from '@eosc-search-service/common';

declare let window: EoscCommonWindow;

export function rerenderComponent$(
  id: string,
  userInfo$: Observable<UserProfile | null>
) {
  return userInfo$.pipe(
    // required for rerendering to work
    delay(0),
    tap((profile) =>
      window.eosccommon.renderMainHeader(`#${id}`, profile ?? undefined)
    )
  );
}
