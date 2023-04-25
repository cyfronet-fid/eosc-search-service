import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { interoperabilityGuidelinesStatusDictionary } from '../dictionary/interoperabilityGuidelinesStatusDictionary';
import { interoperabilityGuidelinesTypeDictionary } from '../dictionary/interoperabilityGuidelinesTypeDictionary';

@Pipe({ name: 'statusPipe' })
export class InteroperabilityGuidelinesFilterPipe implements PipeTransform {
  transform(value: string): string {
    return interoperabilityGuidelinesStatusDictionary[value]
      ? interoperabilityGuidelinesStatusDictionary[value]
      : value;
  }
}

@Pipe({ name: 'guidelineTypePipe' })
export class InteroperabilityGuidelinesTypeFilterPipe implements PipeTransform {
  transform(value: string): string {
    return interoperabilityGuidelinesTypeDictionary[value]
      ? interoperabilityGuidelinesTypeDictionary[value]
      : value;
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
