import { ISecondaryTag } from '@collections/repositories/types';
import { attachHighlightsToTxt, stripHighlightedFromHtml } from '../utils';
import { environment } from '@environment/environment';

export const combineHighlightsWith = (
  tags: ISecondaryTag[],
  highlights: { [field: string]: string[] | undefined }
) => {
  const parsedTags: ISecondaryTag[] = [];
  const size = tags.length;
  for (let i = 0; i < size; i++) {
    const tag = tags[i];
    if (!tag.filter) {
      parsedTags.push(tag);
      continue;
    }

    const matched =
      highlights[tag.filter] ||
      highlights[`${tag.filter}${environment.textGeneralPostfix}`];
    if (!matched || matched.length === 0) {
      parsedTags.push(tag);
      continue;
    }

    const strippedMatched = stripHighlightedFromHtml(matched);
    const highlightedTag = {
      ...tag,
      values: tag.values.map(({ label, value }) => ({
        label: attachHighlightsToTxt(label, strippedMatched),
        value,
      })),
    };
    parsedTags.push(highlightedTag);
  }

  return parsedTags;
};
