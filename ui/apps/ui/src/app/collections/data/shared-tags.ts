import { getName } from '@cospired/i18n-iso-languages';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { IColoredTag } from '@collections/repositories/types';
import { NOT_SPECIFIED_LANG } from '@collections/data/config';

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

export const transformLanguages = (
  values: string | string[] | undefined
): string[] =>
  toArray(values)
    .map((alphaCode) => getName(alphaCode.toLowerCase(), 'en') ?? alphaCode)
    .filter((language) => language !== NOT_SPECIFIED_LANG);

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
