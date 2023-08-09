import { getName } from '@cospired/i18n-iso-languages';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { IColoredTag } from '@collections/repositories/types';

export const toBetaTag = (isBeta: undefined | string): IColoredTag => ({
  colorClassName: 'tag-beta',
  filter: 'beta',
  values:
    isBeta === 'interoperability guideline'
      ? [
          {
            label: '[Beta]',
            value: '' + isBeta,
          },
        ]
      : [],
});

export const toHorizontalServiceTag = (
  isHorizontal: undefined | boolean
): IColoredTag => ({
  colorClassName: 'tag-horizontal',
  filter: 'horizontal',
  values: isHorizontal
    ? [
        {
          label: 'Horizontal Service',
          value: '' + isHorizontal,
        },
      ]
    : [],
});
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
export const toScientificDomainsColoredTag = (
  value: string[] | undefined
): IColoredTag => ({
  values: toValueWithLabel(value || []),
  filter: 'scientific_domains',
  colorClassName: 'tag-light-green',
});
