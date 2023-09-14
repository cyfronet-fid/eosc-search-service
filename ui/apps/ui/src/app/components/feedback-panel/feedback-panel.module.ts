import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackPanelComponent } from './feedback-panel.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackModalComponent } from '@components/feedback-panel/feedback-modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeedbackPanelComponent, FeedbackModalComponent],
  imports: [CommonModule, NgbDropdownModule, FormsModule],
  exports: [FeedbackPanelComponent, FeedbackModalComponent],
})
export class FeedbackPanelModule {}
