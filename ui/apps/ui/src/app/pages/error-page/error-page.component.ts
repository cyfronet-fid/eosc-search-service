import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ess-error-page',
  template: `
    <main>
      <div id="container">
        <div class="row">
          <div class="col">
            <div id="info">
              <h1>Oops!</h1>
              <p id="description">
                We can't seem to find the page you're looking for
              </p>
              <button id="primary-btn" (click)="goToMainPage()">
                Take me to home page
              </button>
            </div>
          </div>
          <div class="col">
            <img
              id="info-graphic"
              src="assets/error.png"
              alt="EOSC User Dashboard"
            />
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [
    `
      #container {
        max-width: 1180px;
        margin: 0 auto;
        text-align: left;
        position: relative;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
      }
      #description {
        padding-bottom: 54px;
      }
      #info-graphic {
        max-width: calc(100% + 150px);
        margin-left: -33px;
        margin-top: -70px;
      }
      h1 {
        font-size: 64px;
        padding-bottom: 56px;
      }
      h3 {
        font-size: 32px;
        padding-bottom: 8px;
      }
      main {
        height: calc(100vh - 36px);
      }
      #primary-btn {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 10px 50px;

        background: linear-gradient(90deg, #3987be 0%, #0c2bd5 100%);
        border-radius: 50px;
        border: none;
        color: white;
      }
    `,
  ],
})
export class ErrorPageComponent {
  constructor(private _router: Router) {}

  async goToMainPage() {
    await this._router.navigateByUrl('');
  }
}
