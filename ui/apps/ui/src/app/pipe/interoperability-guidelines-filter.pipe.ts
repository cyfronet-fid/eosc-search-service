import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { translateDictionaryValue } from '../dictionary/translateDictionaryValue';

@Pipe({ name: 'filterPipe' })
export class InteroperabilityGuidelinesFilterPipe implements PipeTransform {
  transform(value: string, type: string): string {
    return translateDictionaryValue(type, value);
  }
}

@Pipe({ name: 'transformDatePipe' })
export class InteroperabilityGuidelinesTransformDatePipe
  implements PipeTransform
{
  transform(value: string): string {
    return moment(value).format('YYYY-MM-DD');
  }
}
