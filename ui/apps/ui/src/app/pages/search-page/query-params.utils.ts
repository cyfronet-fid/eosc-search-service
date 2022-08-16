export function isArray<T>(val: any): val is T[] {
  return Object.prototype.toString.call(val) === '[object Array]';
}

export function escapeQuery(q: string): string {
  return q.replace(/-|~/g, ' ');
}

export const parseQueryParams = (currentUrl: string) => {
  const queryParams = toQueryParams(currentUrl);
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

export const parseFqToArray = (fq: string | string[]): string[] => {
  if (!fq) {
    return [];
  }
  return fq && !isArray(fq) ? [fq as string] : (fq as unknown as string[]);
};

export const addFq = (
  fqMap: { [filter: string]: string[] },
  filterName: string,
  value: string
): string[] => {
  if (!!fqMap[filterName] && fqMap[filterName].includes(value)) {
    return mapToFqs(fqMap);
  }

  fqMap[filterName] = fqMap[filterName]
    ? [...fqMap[filterName], value]
    : [value];
  return mapToFqs(fqMap);
};

export const removeFq = (
  fqMap: { [filter: string]: string[] },
  filterName: string,
  value: string
): string[] => {
  fqMap[filterName] = (fqMap[filterName] ?? []).filter(
    (currentValue) => currentValue !== value
  );
  return mapToFqs(fqMap);
};

const toFqValues = (fq: string) => {
  const valuesQuery = fq.split(':')[1] || '';
  const values = valuesQuery.split(' OR ') || [];
  return values.map((value) => value.replace(/(\(|\)|")/g, ''));
};
const toFqFilter = (fq: string) => {
  return fq.split(':')[0];
};
const toQueryParams = (url: string) => url.split('?')[1];
export const fqsToMap = (fqs: string[]): { [filter: string]: string[] } =>
  fqs
    .map((fq) => ({ [toFqFilter(fq)]: toFqValues(fq) }))
    .reduce((acc, fq) => ({ ...acc, ...fq }), {});
export const mapToFqs = (fqsMap: { [filter: string]: string[] }) =>
  Object.keys(fqsMap)
    .filter((key) => !!fqsMap[key] && fqsMap[key].length > 0)
    .map(
      (key) =>
        `${key}:(${fqsMap[key].map((value) => `"${value}"`).join(' OR ')})`
    );
