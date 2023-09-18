import { Pipe, PipeTransform } from '@angular/core';

const formatToDisplayNameMap: { [key: string]: string } = {
  bibtex: 'BibTeX',
  ris: 'RIS',
  json_ld: 'JSON-LD',
};

const styleToDisplayNameMap: { [key: string]: string } = {
  apa: 'APA',
  chicago_annotated_bibliography: 'Chicago',
  harvard_cite_them_right: 'Harvard (et.al)',
  harvard_cite_them_right_no_et_al: 'Harvard (no et.al)',
  mla: 'MLA',
  vancouver: 'Vancouver',
};

@Pipe({ name: 'stylePipe' })
export class BibliographyStylesPipe implements PipeTransform {
  transform(value: string): string {
    return styleToDisplayNameMap[value];
  }
}

@Pipe({ name: 'formatPipe' })
export class BibliographyFormatPipe implements PipeTransform {
  transform(value: string): string {
    return formatToDisplayNameMap[value];
  }
}
