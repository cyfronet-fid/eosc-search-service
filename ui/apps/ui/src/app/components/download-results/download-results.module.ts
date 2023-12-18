import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadResultsButtonComponent } from '@components/download-results/download-results-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [DownloadResultsButtonComponent],
  imports: [CommonModule, NgbModule, NzSpinModule],
  exports: [DownloadResultsButtonComponent],
})
export class DownloadResultsModule {}
