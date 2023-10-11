import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import jQuery from 'jquery';

@Component({
  selector: 'ess-feedback-panel',
  templateUrl: './feedback-panel.component.html',
  styleUrls: ['./feedback-panel.component.scss'],
})
export class FeedbackPanelComponent implements OnInit {
  protected readonly ConfigService = ConfigService;

  ngOnInit() {
    this._makeFeedbackForm();
    this._makeReportBugForm();
  }

  private _makeFeedbackForm() {
    jQuery('#zammad-feedback-form').ZammadForm({
      agreementMessage:
        '  Accept EOSC Helpdesk <a target="_blank" href="https://eosc-helpdesk.scc.kit.edu/privacy-policy">Data Privacy Policy</a> & <a target="_blank" href="https://eosc-helpdesk.scc.kit.edu/aup">Acceptable Use Policy</a>',
      messageTitle: 'Submit us a feedback!',
      showTitle: true,
      messageSubmit: 'Submit',
      messageThankYou:
        "Thank you for your inquiry (#%s)! We'll contact you as soon as possible.",
      modal: true,
      targetGroupID: 1,
      noCSS: true,
      attributes: [
        {
          display: 'Name',
          name: 'name',
          tag: 'input',
          type: 'text',
          id: 'zammad-form-name',
          required: true,
          placeholder: 'Your Name',
          defaultValue: '',
        },
        {
          display: 'Email',
          name: 'email',
          tag: 'input',
          type: 'email',
          id: 'zammad-form-email',
          required: true,
          placeholder: 'Your Email',
          defaultValue: '',
        },
        {
          display: 'Message',
          name: 'body',
          tag: 'textarea',
          id: 'zammad-form-body',
          required: true,
          placeholder: 'Your message...',
          defaultValue: '',
          rows: 7,
        },
      ],
    });
  }

  private _makeReportBugForm() {
    jQuery('#zammad-report-bug-form').ZammadForm({
      agreementMessage:
        '  Accept EOSC Helpdesk <a target="_blank" href="https://eosc-helpdesk.scc.kit.edu/privacy-policy">Data Privacy Policy</a> & <a target="_blank" href="https://eosc-helpdesk.scc.kit.edu/aup">Acceptable Use Policy</a>',
      messageTitle: 'Report a bug',
      showTitle: true,
      messageSubmit: 'Submit',
      messageThankYou:
        "Thank you for your inquiry (#%s)! We'll contact you as soon as possible.",
      modal: true,
      targetGroupID: 1,
      noCSS: true,
      attributes: [
        {
          display: 'Name',
          name: 'name',
          tag: 'input',
          type: 'text',
          id: 'zammad-form-name',
          required: true,
          placeholder: 'Your Name',
          defaultValue: '',
        },
        {
          display: 'Email',
          name: 'email',
          tag: 'input',
          type: 'email',
          id: 'zammad-form-email',
          required: true,
          placeholder: 'Your Email',
          defaultValue: '',
        },
        {
          display: 'Where have you found a bug?',
          name: 'address',
          tag: 'input',
          id: 'zammad-form-address',
          required: false,
          placeholder: 'https://example.com',
          defaultValue: '',
        },
        {
          display: 'Description of a bug',
          name: 'body',
          tag: 'textarea',
          id: 'zammad-form-body',
          required: true,
          placeholder: 'Your message...',
          defaultValue: '',
          rows: 7,
        },
      ],
    });
  }
}
