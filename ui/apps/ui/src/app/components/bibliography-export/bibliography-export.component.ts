// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'ess-bibliography-export',
//   templateUrl: './bibliography-export.component.html',
//   styleUrls: ['./bibliography-export.component.css'],
// })
// export class BibliographyExportComponent implements OnInit {
//   constructor() {}

//   ngOnInit(): void {}
// }

import { Component, Input } from '@angular/core';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ess-bibliography-export',
  standalone: true,
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss('Cross click')"
      ></button>
    </div>
    <div class="modal-body">
      <p>Hello, {{ name }}!</p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-dark"
        (click)="activeModal.close('Close click')"
      >
        Close
      </button>
    </div>
  `,
})
export class BibliographyExportContentComponent {
  @Input() name: any;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'ess-bibliography-export',
  standalone: true,
  templateUrl: './bibliography-export.component.html',
})
export class BibliographyExportComponent {
  closeResult = '';
  constructor(private modalService: NgbModal) {}

  open() {
    const modalRef = this.modalService
      .open(BibliographyExportContentComponent, {
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
