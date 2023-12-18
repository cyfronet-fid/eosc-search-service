import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareComponent, ShareModalContentComponent } from './share.component';

@NgModule({
  declarations: [ShareComponent, ShareModalContentComponent],
  imports: [CommonModule, NgbModule],
  exports: [ShareComponent, ShareModalContentComponent],
})
export class ShareModule {}
