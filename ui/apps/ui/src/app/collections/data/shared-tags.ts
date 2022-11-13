import { getName } from '@cospired/i18n-iso-languages';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { IColoredTag } from '@collections/repositories/types';

export const toLanguageColoredTag = (
  values: string | string[] | undefined
): IColoredTag => ({
  colorClassName: 'tag-peach',
  filter: 'language',
  values: toArray(values).map((alphaCode) => ({
    label: getName(alphaCode.toLowerCase(), 'en') ?? alphaCode,
    value: alphaCode,
  })),
});
export const toAccessRightColoredTag = (
  value: string | undefined
): IColoredTag => ({
  values: toValueWithLabel(toArray(value)),
  filter: 'best_access_right',
  colorClassName: (value || '').match(/open(.access)?/gi)
    ? 'tag-light-green'
    : 'tag-light-coral',
});
