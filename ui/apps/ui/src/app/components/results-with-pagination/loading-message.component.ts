import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-loading-message',
  template: `
    <div class="slow-loading-box" *ngIf="show">
      <p id="p1">Searching through
      a vast sea of data!</p>
      <p id="p2">Just a moment while we gather everything
      for you. This should be ready in under
      a minute.</p>
    </div>
  `,
  styles: [`
    .slow-loading-box {
      display: flex;
      width: auto;
      flex-direction: column;
      padding: 24px 24px;
      justify-content: flex-end;
      align-items: flex-start;
      gap: 30px;

      border-radius: 8px;
      background: url('../../../assets/loading_info.png') lightgray 50% / cover no-repeat;

    }

    p {
      color: #EFF1F6;
      font-family: Inter;
    }

    #p1 {
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    #p2 {
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 22.4px */
    }
  `]
})
export class LoadingMessageComponent {
  @Input() show = false;
}
