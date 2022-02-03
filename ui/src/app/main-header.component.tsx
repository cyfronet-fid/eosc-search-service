import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";

const mainHeaderElementName = "eosc-main-header";
@Component({
  selector: 'app-main-header',
  template: '<div #${mainHeaderElementName}></div>',
  encapsulation: ViewEncapsulation.None
})
export class MainHeaderComponent implements OnChanges, AfterViewInit {
  @ViewChild(mainHeaderElementName, {static: false}) containerRef: ElementRef | undefined;

  ngOnChanges(changes: SimpleChanges) {
    // render
  }

  ngAfterViewInit() {
    // render
  }
}
