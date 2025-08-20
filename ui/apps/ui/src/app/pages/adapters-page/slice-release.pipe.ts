import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sliceRelease' })
export class SliceReleasePipe implements PipeTransform {
  transform(value: string): string {
    const parts = value.split('/');
    return parts[parts.length - 1];
  }
}
