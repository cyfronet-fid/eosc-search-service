import {
  Component,
  ElementRef,
  OnInit, Renderer2,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {MocksService} from "./main-page/mocks.service";

@Component({
  selector: 'app-main-header',
  template: `
    <div
      id="eosc-common-main-header"
      data-login-url="http://localhost:8000/api/web/auth/request"
      data-logout-url="http://localhost:8000/api/web/auth/logout"
      #eoscCommonMainHeader
    ></div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class MainHeaderComponent implements OnInit {
  @ViewChild("eoscCommonMainHeader", {static: false}) containerRef: ElementRef | undefined;

  constructor(private _mocksService: MocksService, private _renderer: Renderer2) {}

  ngOnInit() {
    this._mocksService.getUserInfo$()
      .toPromise()
      .then(userinfo => {
        this._renderer.setAttribute(this.containerRef?.nativeElement, "username", userinfo?.username);
        (window as any).renderCustomComponent(
          (window as any).EoscCommonMainHeader,
          { id: "eosc-common-main-header" }
        )
      })
      .catch(error => {
        this._renderer.setAttribute(this.containerRef?.nativeElement, "username", "");
        (window as any).renderCustomComponent(
          (window as any).EoscCommonMainHeader,
          { id: "eosc-common-main-header" }
        )
      })
  }
}
