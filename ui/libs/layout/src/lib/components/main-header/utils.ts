import { catchError, Observable, of, tap } from 'rxjs';
import {EoscCommonWindow} from "@eosc-search-service/common";

declare let window: EoscCommonWindow;

export const rerenderComponent = (
  id: string,
  userInfo$: Observable<{ username: string }>
) => {
  return userInfo$.pipe(
    catchError(() => {
      window.eosccommon.renderMainHeader(`#${id}`);
      return of();
    }),
    tap(({ username }) =>
      window.eosccommon.renderMainHeader(`#${id}`, {
        username,
      })
    )
  );
};
