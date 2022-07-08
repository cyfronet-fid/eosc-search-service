export type HashMap<T> = { [field: string]: T };
export interface IHasId {
  id: string
}

export class AssertionError extends Error {}

export function assertNotNull<T>(obj: T | null | undefined): asserts obj is T {
  if (obj == null) {
    throw new AssertionError('Object is null assertNotNull failed');
  }
}
