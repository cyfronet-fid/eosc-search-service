import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BibliographyComponent,
  BibliographyModalContentComponent,
} from './bibliography.component';
import {
  BibliographyFormatPipe,
  BibliographyStylesPipe,
} from './bibliography-pipe';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [
    BibliographyComponent,
    BibliographyModalContentComponent,
    BibliographyFormatPipe,
    BibliographyStylesPipe,
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NzIconModule,
    NzSpinModule,
  ],
  exports: [
    BibliographyComponent,
    BibliographyModalContentComponent,
    BibliographyFormatPipe,
    BibliographyStylesPipe,
  ],
})
export class BibliographyModule {}
