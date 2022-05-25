import {Pipe, PipeTransform} from "@angular/core";
import {HashMap} from "@eosc-search-service/types";

@Pipe({
  name: 'entries'
})
export class EntriesPipe<T> implements PipeTransform {
  transform(value: HashMap<T>): { key: string, value: T }[] {
    if (value === null || value === undefined) {
      return [];
    }

    return Object.entries(value).map(([key, value]) => ({key, value}));
  }
}
