import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackPanelComponent } from './feedback-panel.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeedbackPanelComponent],
  imports: [CommonModule, NgbDropdownModule, FormsModule],
  exports: [FeedbackPanelComponent],
})
export class FeedbackPanelModule {}
