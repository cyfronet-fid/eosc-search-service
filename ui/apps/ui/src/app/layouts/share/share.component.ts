/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IValueWithLabel } from '@collections/repositories/types';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'ess-share-content',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
})
export class ShareModalContentComponent implements OnInit {
  @Input() url = '';
  @Input() title: string = '';
  @Input() description: string = '';

  emailTitle: string = encodeURIComponent(
    'Take a look at the EOSC resource inside'
  );
  emailBody: string = '';
  emailString: string = '';

  copyLink(popover: any) {
    navigator.clipboard.writeText(this.url);
    popover.open();
    setTimeout(() => {
      popover.close();
    }, 2000);
  }

  constructor(public activeModal: NgbActiveModal, private _meta: Meta) {}

  ngOnInit(): void {
    const emailBody =
      "Hi, I've come across the interesting EOSC resource. Please have a look when you get a chance! " +
      '\n' +
      this.url +
      '\n' +
      'Best Wishes';
    this.emailBody = encodeURIComponent(emailBody);
    this._meta.updateTag({ property: 'og:title', content: this.title });
    this._meta.updateTag({
      property: 'og:description',
      content: this.description,
    });
    this._meta.updateTag({ property: 'og:url', content: this.url });
    this._meta.addTag({ property: 'twitter:card', content: 'summary' });
    this._meta.addTag({ property: 'twitter:title', content: this.title });
    this._meta.addTag({
      property: 'twitter:description',
      content: this.description,
    });
  }
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
  @Input() title: string = '';
  @Input() description: string = '';

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
      case 'catalogue':
      case 'organisation':
      case 'project':
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
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.description = this.description;
  }
}
