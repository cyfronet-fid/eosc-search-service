import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareComponent, ShareModalContentComponent } from './share.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@NgModule({
  declarations: [ShareComponent, ShareModalContentComponent],
  imports: [CommonModule, NgbModule, ShareButtonsModule, ShareIconsModule],
  exports: [ShareComponent, ShareModalContentComponent],
})
export class ShareModule {}
