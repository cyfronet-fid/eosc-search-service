import isArray from 'lodash-es/isArray';
import { countDois } from '@pages/search-page/utils';

export const queryParamsMapFrom = (currentUrl: string) => {
  const queryParams = currentUrl.split('?')[1];
  if (!queryParams || queryParams.trim() === '') {
    return {};
  }

  const parsedQueries: { [key: string]: string | string[] } = {};
  const queries = queryParams.split('&').map((query) => query.split('='));

  // eslint-disable-next-line prefer-const
  for (let [key, val] of queries) {
    val = decodeURIComponent(val);
    if (!parsedQueries[key]) {
      parsedQueries[key] = val;
      continue;
    }

    if (isArray(parsedQueries[key])) {
      (parsedQueries[key] as string[]).push(val);
      continue;
    }

    parsedQueries[key] = [parsedQueries[key] as string, val];
  }

  return parsedQueries;
};

function generatePermutations(words: string[]): string[] {
  const permutations: string[] = [];
  function backtrack(startIndex: number) {
    if (startIndex === words.length - 1) {
      permutations.push(words.join(' '));
      return;
    }

    for (let i = startIndex; i < words.length; i++) {
      [words[startIndex], words[i]] = [words[i], words[startIndex]]; // Swap words
      backtrack(startIndex + 1);
      [words[startIndex], words[i]] = [words[i], words[startIndex]]; // Restore original order
    }
  }

  backtrack(0);
  return permutations;
}

export function getFiltersFromTags(
  tags: string[] | string,
  radioValueAuthor: string,
  radioValueExact: string,
  radioValueTitle: string,
  radioValueKeyword: string
) {
  let filters: string[] = [];

  const authors: number[] = [];
  const exacts: number[] = [];
  const titles: number[] = [];
  const keywords: number[] = [];
  const dois: number[] = [];
  const allIndexes: number[] = [];

  if (Array.isArray(tags)) {
    for (const tag of tags) {
      if (tag.startsWith('author:')) {
        const aut = tag.split(':', 2)[1].trim();
        const splitted = aut.split(' ');
        const query_param: string[] = [];
        splitted.forEach((el: string) => {
          if (el.trim() !== '') {
            query_param.push(el.trim());
          }
        });
        const res_permuted = generatePermutations(query_param);
        if (res_permuted.length === 1) {
          filters.push('author_names_tg:"' + res_permuted[0].trim() + '"');
          authors.push(filters.length - 1);
        } else {
          // We need OR case
          let fin = '';
          res_permuted.forEach((el: string) => {
            fin += 'author_names_tg:"' + el.trim() + '"' + ' OR ';
          });
          filters.push(fin.slice(0, fin.length - 4));
          authors.push(filters.length - 1);
        }
      }
      if (tag.startsWith('exact:')) {
        filters.push(
          'title:"' +
            tag.split(':', 2)[1].trim() +
            '" OR author_names_tg:"' +
            tag.split(':', 2)[1].trim() +
            '" OR description:"' +
            tag.split(':', 2)[1].trim() +
            '" OR keywords_tg:"' +
            tag.split(':', 2)[1].trim() +
            '" OR doi:"' +
            tag.split(':', 2)[1].trim() +
            '"'
        );
        exacts.push(filters.length - 1);
      }
      if (tag.startsWith('none of:')) {
        filters.push('!title:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!author_names_tg:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!description:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!doi:"' + tag.split(':', 2)[1].trim() + '"');
      }
      if (tag.startsWith('in title:')) {
        filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
        titles.push(filters.length - 1);
      }
      if (tag.startsWith('keyword:')) {
        filters.push('keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
        keywords.push(filters.length - 1);
      }
      if (tag.startsWith('doi:')) {
        filters.push('doi:"' + tag.split(':', 2)[1].trim() + '"');
        dois.push(filters.length - 1);
      }
    }
  } else {
    const tag: string = tags;
    if (tag.startsWith('author:')) {
      const aut = tag.split(':', 2)[1].trim();
      const splitted = aut.split(' ');
      const query_param: string[] = [];
      splitted.forEach((el: string) => {
        if (el.trim() !== '') {
          query_param.push(el.trim());
        }
      });
      const res_permuted = generatePermutations(query_param);
      if (res_permuted.length === 1) {
        filters.push('author_names_tg:"' + res_permuted[0].trim() + '"');
        authors.push(filters.length - 1);
      } else {
        // We need OR case
        let fin = '';
        res_permuted.forEach((el: string) => {
          fin += 'author_names_tg:"' + el.trim() + '"' + ' OR ';
        });
        filters.push(fin.slice(0, fin.length - 4));
        authors.push(filters.length - 1);
      }
    }
    if (tag.startsWith('exact:')) {
      filters.push(
        'title:"' +
          tag.split(':', 2)[1].trim() +
          '" OR author_names_tg:"' +
          tag.split(':', 2)[1].trim() +
          '" OR description:"' +
          tag.split(':', 2)[1].trim() +
          '" OR keywords_tg:"' +
          tag.split(':', 2)[1].trim() +
          '" OR doi:"' +
          tag.split(':', 2)[1].trim() +
          '"'
      );
      exacts.push(filters.length - 1);
    }
    if (tag.startsWith('none of:')) {
      filters.push('!title:"' + tag.split(':', 2)[1].trim() + '"');
      filters.push('!author_names_tg:"' + tag.split(':', 2)[1].trim() + '"');
      filters.push('!description:"' + tag.split(':', 2)[1].trim() + '"');
      filters.push('!keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
      filters.push('!doi:"' + tag.split(':', 2)[1].trim() + '"');
    }
    if (tag.startsWith('in title:')) {
      filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
      titles.push(filters.length - 1);
    }
    if (tag.startsWith('doi:')) {
      filters.push('doi:"' + tag.split(':', 2)[1].trim() + '"');
      dois.push(filters.length - 1);
    }
    if (tag.startsWith('keyword:')) {
      filters.push('keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
      keywords.push(filters.length - 1);
    }
  }

  // Merge doi tags with OR by default
  if (countDois(tags) >= 2) {
    let new_aut = '';
    for (const doi of dois) {
      new_aut += filters[doi] + ' OR ';
      allIndexes.push(doi);
    }
    new_aut = new_aut.slice(0, new_aut.length - 4);
    filters.push(new_aut);
  }

  if (radioValueAuthor === 'B') {
    let new_aut = '';
    for (const author of authors) {
      new_aut += filters[author] + ' OR ';
      allIndexes.push(author);
    }
    new_aut = new_aut.slice(0, new_aut.length - 4);
    filters.push(new_aut);
  }
  if (radioValueExact === 'B') {
    let new_exc = '';
    for (const exactel of exacts) {
      new_exc += filters[exactel] + ' OR ';
      allIndexes.push(exactel);
    }
    new_exc = new_exc.slice(0, new_exc.length - 4);
    filters.push(new_exc);
  }
  if (radioValueTitle === 'B') {
    let new_title = '';
    for (const exactit of titles) {
      new_title += filters[exactit] + ' OR ';
      allIndexes.push(exactit);
    }
    new_title = new_title.slice(0, new_title.length - 4);
    filters.push(new_title);
  }
  if (radioValueKeyword === 'B') {
    let new_keyword = '';
    for (const keywordel of keywords) {
      new_keyword += filters[keywordel] + ' OR ';
      allIndexes.push(keywordel);
    }
    new_keyword = new_keyword.slice(0, new_keyword.length - 4);
    filters.push(new_keyword);
  }

  filters = filters.filter((value, index) => !allIndexes.includes(index));

  return filters;
}
