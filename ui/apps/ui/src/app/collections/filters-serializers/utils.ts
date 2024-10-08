/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray } from 'lodash-es';
import {
  IValueWithLabel,
  RelatedService,
} from '@collections/repositories/types';
import { AccessRight } from '@collections/repositories/types';

const REGEXP_SPECIAL_CHAR = /[-/]/g;

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

export const toRelatedService = (
  values: Record<string, any>[]
): RelatedService[] => {
  return values.map((value) => ({
    pid: value['pid'],
    best_access_right: value['best_access_right']?.toLowerCase() as AccessRight,
    title: value['title'],
    resource_organisation: value['resource_organisation'],
    tagline: value['tagline'],
    joined_categories: value['joined_categories'],
    type: value['type'],
    logoUrl: value['logoUrl'],
  }));
};

export const queryChanger = (q: string, exact: boolean): string => {
  q = q.trim();
  if (q === '*') {
    return q;
  }

  const addFuzzySearchSign = (word: string): string => {
    if (word.length > 5 && (word.includes('/') || word.includes('-'))) {
      const n = `${word}`.replace(REGEXP_SPECIAL_CHAR, ' ');
      const words = n.split(' ');
      words.forEach(function (el, index) {
        if (el.length > 5 && !exact) {
          words[index] = `${el}~1`;
        } else {
          words[index] = `${el}`;
        }
      });
      return words.join(' ');
    } else if (word.length > 5 && !exact) {
      return `${word}~1`;
    } else {
      return `${word}`.replace(REGEXP_SPECIAL_CHAR, ' ');
    }
  };

  if (!exact) {
    const words = q.split(' ');
    return words.map(addFuzzySearchSign).join(' ');
  } else {
    return '"' + addFuzzySearchSign(q) + '"';
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const queryChangerAdv = (q: string, exact: boolean): string => {
  q = q.trim();
  if (q === '*') {
    return q;
  }

  const addFuzzySearchSign = (word: string): string => {
    if (word.length > 5 && (word.includes('/') || word.includes('-'))) {
      const n = `${word}`.replace(REGEXP_SPECIAL_CHAR, ' ');
      const words = n.split(' ');
      words.forEach(function (el, index) {
        if (el.length > 5 && !exact) {
          words[index] = `${el}~1`;
        } else {
          words[index] = `${el}`;
        }
      });
      return words.join(' ');
    } else if (word.length > 5 && !exact) {
      return `${word}~1`;
    } else {
      return `${word}`.replace(REGEXP_SPECIAL_CHAR, ' ');
    }
  };

  if (!exact) {
    const words = q.split(' ');
    return words.map(addFuzzySearchSign).join(' ');
  } else {
    return '"' + addFuzzySearchSign(q) + '"';
  }
};
