import { isArray } from 'lodash-es';
import { IValueWithLabel } from '@collections/repositories/types';

export const sanitizeValue = (value: string): string =>
  value.replace(/[+\-&|!()"~*?:\\/]/g, (match) => `\\${match.split('')}`);
export const sanitizationReverse = (value: string): string =>
  value.replace(/\\[+\-&|!()"~*?:\\/]/g, (match) => match.replace('\\', ''));

export const toArray = (value: unknown): string[] => {
  if (!value) {
    return [];
  }
  return isArray(value) ? (value as string[]) : [value as string];
};
export const toValueWithLabel = (values: string[]): IValueWithLabel[] => {
  return values.map((value) => ({ label: value, value }));
};

export const queryChanger = (q: string): string =>
  q
    .split(' ')
    .map((word) => `${word}~1`)
    .join(' ');
