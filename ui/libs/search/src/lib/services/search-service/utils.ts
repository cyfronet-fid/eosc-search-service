export function concatArrays<T>(arrays: T[][]) {
  const output: T[] = [];
  const length: number = arrays.reduce((pv, cv) => Math.max(pv, cv.length), 0)

  for(let i = 0; i < length; ++i) {
    arrays.forEach(array => {
      if (array.length > i) {
        output.push(array[i])
      }
    });
  }

  return output
}

export function escapeQuery(q: string): string {
  return q.replace(/-|~/g, " ");
}
