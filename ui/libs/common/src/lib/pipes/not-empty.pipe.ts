import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'notEmpty'
})
export class NotEmptyPipe implements PipeTransform {
  transform(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (value?.length === 0) {
      return false;
    }
    if (value?.length > 0) {
      return true;
    }

    return Object.keys(value).length > 0;
  }
}
