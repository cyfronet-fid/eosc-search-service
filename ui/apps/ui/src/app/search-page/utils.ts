import { environment } from '../../environments/environment';
import { isArray, parseQueryParams } from '../utils';

export const getCollections = (urlPathWithQueries: string) => {
  const [path, params] = urlPathWithQueries.split('?');
  const parsedParams = parseQueryParams(params);
  const set = environment.search.sets.find(
    (set) => path.endsWith(set.urlPath) && set.urlPath !== 'trainings'
  );

  set?.collections.forEach((collection) => {
    collection.params.cursor = '*'; // clear last cursor
    collection.q = (parsedParams['q'] as string) || '*'; // update query
    collection.params.fq = parseFqToArray(parsedParams['fq']); // update filters
  });
  return set?.collections || [];
};

export const parseFqToArray = (fq: string | string[]): string[] => {
  if (!fq) {
    return [];
  }
  if (fq && !isArray(fq)) {
    return [fq as string];
  }
  return fq as string[];
};

export const addFq = (
  urlPathWithQueries: string,
  filterName: string,
  value: string
): string[] => {
  const fqs = getFqsFromUrl(urlPathWithQueries);
  const newFilter = `${filterName}:"${value.replace(/"/g, '')}"`;
  const filterIndex = fqs.indexOf(newFilter);

  if (filterIndex >= 0) {
    return fqs;
  }

  fqs.push(newFilter);
  return fqs;
};

export const removeFq = (
  urlPathWithQueries: string,
  filterName: string,
  value: string
): string[] => {
  const fqs = getFqsFromUrl(urlPathWithQueries);
  const newFilter = `${filterName}:"${value.replace(/"/g, '')}"`;
  const filterIndex = fqs.indexOf(newFilter);

  if (filterIndex === -1) {
    return fqs;
  }

  fqs.splice(filterIndex, 1);
  return fqs;
};

export const getFqsFromUrl = (urlPathWithQueries: string): string[] =>
  parseFqToArray(parseQueryParams(urlPathWithQueries.split('?')[1])['fq']);
