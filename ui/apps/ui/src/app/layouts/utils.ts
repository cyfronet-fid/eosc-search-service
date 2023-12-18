/* eslint-disable @typescript-eslint/no-explicit-any */
export const stripHighlightedFromHtml = (
  highlights: string[] | undefined
): string[] => {
  if (!highlights || highlights.length === 0) {
    return [];
  }

  const highlightedTxt: string[] = [];
  const highlightsSize = highlights.length;
  for (let i = 0; i < highlightsSize; i++) {
    for (const match of highlights[i].matchAll(/<em>[^<>]*<\/em>/g)) {
      const strippedMatch = match[0].replace('<em>', '').replace('</em>', '');
      highlightedTxt.push(strippedMatch);
    }
  }

  return highlightedTxt;
};

export const attachHighlightsToTxt = (
  strippedTxt: string,
  highlightedTxt: string[]
): string => {
  const lowercasedSet = new Set<string>();

  const uniqueHighlightedTxt = highlightedTxt.filter((value) => {
    const lowercasedValue = value.toLowerCase();
    if (!lowercasedSet.has(lowercasedValue)) {
      lowercasedSet.add(lowercasedValue);
      return true;
    }
    return false;
  });

  const size = uniqueHighlightedTxt.length;
  for (let i = 0; i < size; i++) {
    //const pattern = new RegExp(
    //  `(?:^|\\s|\\(|\\-|>|/)([^\\w]*` +
    //    uniqueHighlightedTxt[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
    //    '[^\\w]*)(?:\\)|\\?|/|\\-|\\w|\\+|<|$|\\s)',
    //  'gi'
    //);
    const pattern = new RegExp(
      `(?:^|\\s|\\(|\\-|>|/)([^\\w]*` +
        uniqueHighlightedTxt[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
        '(?!\\s)?<?[^\\w]*)(?:\\)|\\?|/|\\-|\\w|\\+|$|\\s)',
      'gi'
    );

    const replacement = (match: string, group: any) => {
      if (group.endsWith('<')) {
        group = group.slice(0, -1);
      }
      return match.replace(group, `<span class="highlighted">${group}</span>`);
    };

    strippedTxt = strippedTxt.replace(pattern, replacement);
  }

  return strippedTxt;
};
