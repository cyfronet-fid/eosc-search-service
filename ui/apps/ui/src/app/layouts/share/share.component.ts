import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IValueWithLabel } from '@collections/repositories/types';

@Component({
  selector: 'ess-share-content',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
})
export class ShareModalContentComponent {
  @Input() url = '';

  copyLink(popover: any) {
    navigator.clipboard.writeText(this.url);
    popover.open();
    setTimeout(() => {
      popover.close();
    }, 2000);
  }

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'ess-share',
  template: `
    <div (click)="open()">
      <a href="javascript:void(0)" class="link-share">Share</a>
    </div>
  `,
})
export class ShareComponent {
  @Input() urls: string[] = [];
  @Input() shareUrl: string | null = null;

  @Input() type!: IValueWithLabel;

  constructor(private modalService: NgbModal, private _router: Router) {}

  setUrl() {
    switch (this.type.value) {
      case 'dataset':
      case 'publication':
      case 'software':
      case 'other':
        return this.urls[0];
      case 'training':
      case 'guideline':
        return (
          window.location.origin + this._router.createUrlTree([this.shareUrl])
        );
      case 'data-source':
      case 'service':
      case 'bundle':
      case 'provider':
        return this.shareUrl;
      default:
        return '';
    }
  }

  open() {
    const modalRef = this.modalService.open(ShareModalContentComponent, {
      windowClass: 'share-modal-window',
    });
    modalRef.componentInstance.url = this.setUrl();
  }
}
