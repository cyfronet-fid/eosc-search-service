import isArray from 'lodash-es/isArray';

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
