import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';

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
    FormsModule,
    NgbTooltipModule,
    NzIconModule,
    NzSpinModule,
    NzCardModule,
    NzDropDownModule,
    NzRadioModule,
  ],
  exports: [
    BibliographyComponent,
    BibliographyModalContentComponent,
    BibliographyFormatPipe,
    BibliographyStylesPipe,
  ],
})
export class BibliographyModule {}
