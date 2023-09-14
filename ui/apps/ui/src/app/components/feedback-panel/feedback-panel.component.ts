import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackModalComponent } from '@components/feedback-panel/feedback-modal.component';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'ess-feedback-panel',
  template: `
    <div class="circle-widget">
      <div ngbDropdown class="d-inline-block" placement="auto">
        <button
          class="btn btn-primary feedback-dropdown-button"
          style="background: #303030"
          id="dropdownFeedback"
          ngbDropdownToggle
        >
          <span class="question-mark">?</span>
        </button>
        <ul
          ngbDropdownMenu
          aria-labelledby="dropdownFeedback"
          class="feedback-dropdown-menu"
        >
          <li>
            <a class="menu-item" (click)="openFeedbackModal()"
              >Submit feedback</a
            >
          </li>
          <li class="menu-separator"></li>
          <li>
            <a class="menu-item" (click)="openBugReportModal()">Report a bug</a>
          </li>
          <li class="menu-separator"></li>
          <li>
            <a
              class="menu-item"
              [href]="ConfigService.config?.marketplace_url + '/help'"
              >FAQ</a
            >
          </li>
          <li class="menu-separator"></li>
          <li>
            <a
              class="menu-item"
              [href]="ConfigService.config?.knowledge_hub_url"
              >Knowledge Hub</a
            >
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./feedback-panel.component.scss'],
})
export class FeedbackPanelComponent {
  protected readonly ConfigService = ConfigService;

  constructor(private modalService: NgbModal) {}

  openFeedbackModal() {
    const modalRef = this.modalService.open(FeedbackModalComponent);
    modalRef.componentInstance.modalTitle = 'Submit feedback';
  }

  openBugReportModal() {
    const modalRef = this.modalService.open(FeedbackModalComponent);
    modalRef.componentInstance.modalTitle = 'Report a bug';
  }
}
