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
  const size = highlightedTxt.length;
  for (let i = 0; i < size; i++) {
    const pattern = new RegExp('\\b(' + highlightedTxt[i] + ')\\b', 'gi');

    const replacement = `<span class="highlighted">${highlightedTxt[i]}</span>`;
    strippedTxt = strippedTxt.replace(pattern, replacement);
  }

  return strippedTxt;
};
