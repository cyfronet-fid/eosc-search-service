import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesPageComponent } from './articles-page.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ArticlesPageComponent],
  imports: [CommonModule, NzSelectModule, NzDatePickerModule, NgbRatingModule],
})
export class ArticlesPageModule {}
