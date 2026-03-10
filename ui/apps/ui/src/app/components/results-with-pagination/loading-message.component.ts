import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-loading-message',
  template: `
    <div class="slow-loading-box" *ngIf="show">
      <p id="p1">
        Searching through<br />
        a vast sea of data!
      </p>
      <p id="p2">
        Just a moment while we gather everything for you. This should be ready
        in <strong>under a minute.</strong>
      </p>
    </div>
  `,
  styles: [
    `
      .slow-loading-box {
        display: flex;
        width: 430px;
        flex-direction: column;
        padding: 24px 24px;
        justify-content: flex-end;
        align-items: flex-start;

        border-radius: 8px;
        background: #edf4ff url('../../../assets/search-bg.png') no-repeat;
        background-position: bottom right;
        box-shadow: 4px 4px 8px 0 rgba(42, 48, 98, 0.2);
      }

      #p1 {
        font-size: 24px;
        color: #010e87;
        font-style: normal;
        margin-bottom: 14px;
        font-weight: 600;
        line-height: normal;
      }

      #p2 {
        font-size: 16px;
        font-style: normal;
        color: #4c505a;
        font-weight: 500;
        margin: 0;
        line-height: 140%; /* 22.4px */
      }
    `,
  ],
})
export class LoadingMessageComponent {
  @Input() show = false;
}
