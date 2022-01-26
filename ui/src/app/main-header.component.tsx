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

import * as React from "react";
import { render, unmountComponentAtNode } from 'react-dom'
window.React = React

const mainHeaderElementName = "eosc-main-header";
@Component({
  selector: 'app-main-header',
  template: '<div #${mainHeaderElementName}></div>',
  encapsulation: ViewEncapsulation.None
})
export class MainHeaderComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(mainHeaderElementName, {static: false}) containerRef: ElementRef | undefined;

  ngOnChanges(changes: SimpleChanges) {
    this.render()
  }

  ngAfterViewInit() {
    this.render()
  }

  ngOnDestroy() {
    unmountComponentAtNode(this.containerRef?.nativeElement)
  }

  private render() {
    const __html = `
      <EoscCommonMainHeader
        username=""
        login-url="http://localhost:8000/api/v1/auth/request"
        logout-url="/auth/logout"
      />
    `
    render(
      <div dangerouslySetInnerHTML={{ __html }} />,
      this.containerRef?.nativeElement
    )
  }
}
