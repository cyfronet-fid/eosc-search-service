import {createStore, select, setProps, withProps} from "@ngneat/elf";
import {
  createRequestsStatusOperator,
  updateRequestStatus,
  withRequestsStatus
} from "@ngneat/elf-requests";
import {shareReplay} from "rxjs";

export interface UserProfile {
  username: string;
}

export interface UserProfileProps {
  profile: UserProfile | null;
}

export const userProfileStore = createStore(
  {
    name: 'userProfile',
  },
  withProps<UserProfileProps>({profile: null}),
  withRequestsStatus<'profile'>()
);

export function setUserProfile(profile: UserProfile) {
  userProfileStore.update(
    setProps({profile}),
    updateRequestStatus('profile', 'success')
  );
}

export const user$ = userProfileStore.pipe(select(s => s.profile), shareReplay({refCount: true}));

export const trackUserProfileRequestsStatus = createRequestsStatusOperator(userProfileStore);

