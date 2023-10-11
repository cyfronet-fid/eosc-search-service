import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  BIBLIOGRAPHY_TOOLTIP_TEXT,
  CITATIONS_NOT_AVAILABLE_TOOLTIP_TEXT,
} from '@collections/data/config';

@Component({
  selector: 'ess-bibliography-content',
  templateUrl: './bibliography.component.html',
  styles: [
    `
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.7);
        text-align: center;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
      }
    `,
  ],
})
export class BibliographyModalContentComponent {
  @Input() parsedUrls: { [key: string]: string } = {};
  @Input() formats: string[] = [];
  @Input() hasDOIUrl = false;

  public isLoading = false;
  public citationEmptyMessage = '';
  public exportButtonText = 'Export bibliography data';
  public showCopiedSuccessButton = false;
  public formatsChecked = false;
  public unavailableStyles: string[] = [];
  public availableFormats: string[] = [];
  public bibliographyRecords: { [key: string]: string } = {};
  public exportDropdownTitle = '';
  public selectedSource: FormControl = new FormControl();
  public selectedFormat = '';
  public citation = '';
  private formatToExtensionMap: { [key: string]: string } = {
    bibtex: 'bib',
    ris: 'ris',
    json_ld: 'json',
  };
  // some of the styles are temporary switched off due to the number of records we are not able to generate it.
  public styles: string[] = [
    'apa',
    // 'chicago_annotated_bibliography',
    // 'harvard_cite_them_right',
    // 'harvard_cite_them_right_no_et_al',
    'mla',
    'vancouver',
  ];

  bibliograhpyTooltipText = BIBLIOGRAPHY_TOOLTIP_TEXT;
  constructor(
    public activeModal: NgbActiveModal,
    private _fetchDataService: FetchDataService
  ) {}

  clearVariables() {
    this.isLoading = false;
    this.citationEmptyMessage = '';
    this.formatsChecked = false;
    this.unavailableStyles = [];
    this.availableFormats = [];
    this.bibliographyRecords = {};
    this.selectedFormat = '';
    this.citation = '';
  }

  cite(style: string) {
    this.isLoading = true;
    this.citation = '';
    this.citationEmptyMessage = '';
    const pid = this.parsedUrls[this.selectedSource.value];
    this._fetchDataService.fetchCitation$(pid, style).subscribe((response) => {
      if (response.citation) {
        this.citation = response.citation;
      } else {
        this.unavailableStyles.push(style);
        this.citationEmptyMessage =
          'Unfortunately we are unable to generate this citation format as this source ' +
          'does not provide us with the information needed to generate the required format. ' +
          'Please also check other sources If possible.';
      }
      this.isLoading = false;
    });
  }

  copy() {
    navigator.clipboard.writeText(this.citation);
    this.showCopiedSuccessButton = true;
    setTimeout(() => {
      this.showCopiedSuccessButton = false;
    }, 2000);
  }

  setSelectedFormat(format: string) {
    this.selectedFormat = format;
    this.exportButtonText = 'Export';
  }

  export(format: string) {
    const selectedRecord = this.bibliographyRecords[format];
    const extension = this.formatToExtensionMap[format];
    const filename = `${format}.${extension}`;
    const file = new File([selectedRecord], filename);
    const a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  getAvailableFormats(doi: string) {
    this.clearVariables();
    this.availableFormats = [];
    this.bibliographyRecords = {};
    this._fetchDataService.fetchExport$(doi).subscribe((response) => {
      response.map((format) => {
        this.availableFormats.push(format.type);
        this.bibliographyRecords[format.type] = format.record;
      });
      this.formatsChecked = true;
    });
  }
}

@Component({
  selector: 'ess-bibliography',
  template: `
    <ng-container *ngIf="this.hasDOIUrl; else elseBlock">
      <a href="javascript:void(0)" (click)="open()" class="link-cite">Cite</a>
    </ng-container>

    <ng-template #elseBlock>
      <div
        ngbTooltip="{{ linkTooltipText }}"
        [ngStyle]="{ width: 'fit-content' }"
      >
        <a
          href="javascript:void(0)"
          class="link-cite"
          [ngStyle]="{ pointerEvents: 'none', color: 'grey' }"
          >Cite</a
        >
      </div>
    </ng-template>
  `,
})
export class BibliographyComponent {
  @Input() title = '';
  @Input() parsedUrls: { [key: string]: string } = {};
  @Input() hasDOIUrl = false;
  public formats: string[] = ['bibtex', 'ris', 'json_ld'];

  constructor(private modalService: NgbModal) {}
  linkTooltipText: string = CITATIONS_NOT_AVAILABLE_TOOLTIP_TEXT;

  open() {
    const modalRef = this.modalService.open(BibliographyModalContentComponent);
    modalRef.componentInstance.parsedUrls = this.parsedUrls;
    modalRef.componentInstance.formats = this.formats;
    modalRef.componentInstance.hasDOIUrl = this.hasDOIUrl;
  }
}
