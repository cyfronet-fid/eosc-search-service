import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackPanelService } from '@components/feedback-panel/feedback-panel.service';

@Component({
  selector: 'ess-feedback-modal',
  templateUrl: './feedback-modal.component.html',
})
export class FeedbackModalComponent {
  modalTitle = 'Submit feedback';

  name = '';
  email = '';
  subject = '';
  message = '';

  constructor(
    public activeModal: NgbActiveModal,
    private feedbackPanelService: FeedbackPanelService
  ) {}

  async submitForm() {
    if (!this.subject || !this.email || !this.name || !this.message) {
      alert('All fields are required. Please fill in the form.');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      alert('Please provide a valid email address.');
      return;
    }

    const feedbackData = {
      subject: this.subject,
      email: this.email,
      name: this.name,
      message: this.message,
    };
    this.feedbackPanelService.createFeedbackTicket(feedbackData).subscribe(
      () => {
        this.activeModal.close('Form submitted');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }
}
