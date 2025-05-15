import { ICustomRouteProps } from '@collections/services/custom-route.type';
import { ICollectionSearchMetadata } from '@collections/repositories/types';
import {
  queryChanger,
  queryChangerAdv,
} from '@collections/filters-serializers/utils';
import { ConfigService } from '../../services/config.service';

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
const doiCollections = [
  'all_collection',
  'publication',
  'software',
  'dataset',
  'other',
];
function _setExactTag(collection: string, tag: string) {
  if (doiCollections.includes(collection)) {
    return (
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
  } else {
    return (
      'title:"' +
      tag.split(':', 2)[1].trim() +
      '" OR author_names_tg:"' +
      tag.split(':', 2)[1].trim() +
      '" OR description:"' +
      tag.split(':', 2)[1].trim() +
      '" OR keywords_tg:"' +
      tag.split(':', 2)[1].trim() +
      '"'
    );
  }
}

function _setNoneOfTag(collection: string, tag: string) {
  const tags = [];
  tags.push('!title:"' + tag.split(':', 2)[1].trim() + '"');
  tags.push('!description:"' + tag.split(':', 2)[1].trim() + '"');
  tags.push('!keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
  tags.push('!author_names_tg:"' + tag.split(':', 2)[1].trim() + '"');
  if (doiCollections.includes(collection)) {
    tags.push('!doi:"' + tag.split(':', 2)[1].trim() + '"');
  }
  return tags;
}

export function constructAdvancedSearchMetadata(
  routerParams: ICustomRouteProps,
  metadata: ICollectionSearchMetadata
) {
  let filters: string[] = [];

  const authors: number[] = [];
  const exacts: number[] = [];
  const titles: number[] = [];
  const keywords: number[] = [];
  const dois: number[] = [];
  const allIndexes: number[] = [];

  const fq_o: string[] = routerParams.fq;
  const radioValueAuthor: string = routerParams.radioValueAuthor;
  const radioValueExact: string = routerParams.radioValueExact;
  const radioValueTitle: string = routerParams.radioValueTitle;
  const radioValueKeyword: string = routerParams.radioValueKeyword;
  const isProvider = metadata.id === 'provider';
  if (Array.isArray(routerParams.tags)) {
    for (const tag of routerParams.tags) {
      if (tag.startsWith('author:') && !isProvider) {
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
        filters.push(_setExactTag(metadata.id, tag));
        exacts.push(filters.length - 1);
      }
      if (tag.startsWith('none of:')) {
        const tagsToPush = _setNoneOfTag(metadata.id, tag);
        tagsToPush.forEach((tagToPush) => filters.push(tagToPush));
      }
      if (tag.startsWith('in title:')) {
        filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
        titles.push(filters.length - 1);
      }
      if (tag.startsWith('doi:')) {
        filters.push('doi:"' + tag.split(':', 2)[1].trim() + '"');
        dois.push(filters.length - 1);
      }
      if (tag.startsWith('keyword:') && !isProvider) {
        filters.push('keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
        keywords.push(filters.length - 1);
      }
    }
  } else {
    const tag: string = routerParams.tags;
    if (tag.startsWith('author:') && !isProvider) {
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
      filters.push(_setExactTag(metadata.id, tag));
      exacts.push(filters.length - 1);
    }
    if (tag.startsWith('none of:')) {
      const tagsToPush = _setNoneOfTag(metadata.id, tag);
      tagsToPush.forEach((tagToPush) => filters.push(tagToPush));
    }
    if (tag.startsWith('in title:')) {
      filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
      titles.push(filters.length - 1);
    }
    if (tag.startsWith('doi:')) {
      filters.push('doi:"' + tag.split(':', 2)[1].trim() + '"');
      dois.push(filters.length - 1);
    }
    if (tag.startsWith('keyword:') && !isProvider) {
      filters.push('keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
      keywords.push(filters.length - 1);
    }
  }

  // Merge doi tags with OR by default
  if (countDois(routerParams.tags) >= 2) {
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

  const fq_m = filters.concat(fq_o);

  const searchMetadata = {
    rows: getMaxResultsByPage(),
    ...routerParams,
    ...metadata.params,
    exact: routerParams.exact.toString() === 'true' ? 'true' : 'false',
    q: queryChangerAdv(
      routerParams.q,
      routerParams.exact.toString() === 'true'
    ),
    fq: fq_m,
  };
  return searchMetadata;
}

export function constructStandardSearchMetadata(
  routerParams: ICustomRouteProps,
  metadata: ICollectionSearchMetadata
) {
  const searchMetadata = {
    rows: getMaxResultsByPage(),
    ...routerParams,
    ...metadata.params,
    exact: routerParams.exact.toString() === 'true' ? 'true' : 'false',
    q: queryChanger(routerParams.q, routerParams.exact.toString() === 'true'),
  };
  return searchMetadata;
}

export function countDois(tags: string | string[]): number {
  const tagsArray = typeof tags === 'string' ? [tags] : tags;
  // Count the occurrences of doi tags
  const doiCount = tagsArray.reduce((count, tag) => {
    if (tag.startsWith('doi:')) {
      return count + 1;
    }
    return count;
  }, 0);
  return doiCount;
}

export const getMaxResultsByPage = () =>
  ConfigService.config?.max_results_by_page ?? 50;
