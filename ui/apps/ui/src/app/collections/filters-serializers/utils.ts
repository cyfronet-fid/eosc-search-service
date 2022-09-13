import { isArray } from 'lodash-es';

export const sanitizeValue = (value: string): string =>
  value.replace(/[+\-&|!()"~*?:\\]/g, (match) => `\\${match.split('')}`);
export const sanitizationReverse = (value: string): string =>
  value.replace(/\\[+\-&|!()"~*?:\\]/g, (match) => match.replace('\\', ''));

export const toArray = (value: string | string[]): string[] => {
  if (!value) {
    return [];
  }
  return isArray(value) ? (value as string[]) : [value as string];
};
