import { ITag } from '@collections/repositories/types';
import { environment } from '@environment/environment';
import { attachHighlightsToTxt, stripHighlightedFromHtml } from '../utils';

export const combineHighlightsWith = (
  tags: ITag[],
  highlights: { [field: string]: string[] | undefined }
) => {
  const parsedTags: ITag[] = [];
  const size = tags.length;
  for (let i = 0; i < size; i++) {
    const tag = tags[i];

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
