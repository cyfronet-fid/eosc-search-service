import {map, Observable} from "rxjs";

/**
 * Apply map to observable and map on array using provided function
 *
 * @param _func
 */
export function mapArray<T, V>(_func: (element: T) => V) {
  return function(source: Observable<T[]>): Observable<V[]> {
    return source.pipe(map(array => array.map(_func)));
  }
}
