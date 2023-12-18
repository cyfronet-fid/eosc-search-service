/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  BIBLIOGRAPHY_TOOLTIP_TEXT,
  CITATIONS_NOT_AVAILABLE_TOOLTIP_TEXT,
} from '@collections/data/config';
import { InstanceExportData } from '@collections/data/openair.model';

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
  radioValue = 'A';
  @Input() formats: string[] = [];

  @Input() exportData: InstanceExportData[] = [];

  public isLoading = false;
  public citationEmptyMessage = '';
  public exportButtonText = 'Export bibliography data';
  public showCopiedSuccessButton = false;
  public formatsChecked = false;
  public unavailableStyles: string[] = [];
  public availableFormats: string[] = [];
  public bibliographyRecords: { [key: string]: string } = {};
  public exportDropdownTitle = '';
  public selectedSource = '';
  public selectedCard = -1;
  public instanceDOI = '';
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
    this.instanceDOI = '';
  }

  cite(style: string) {
    this.isLoading = true;
    this.citation = '';
    this.citationEmptyMessage = '';

    this._fetchDataService
      .fetchCitation$(this.instanceDOI, style)
      .subscribe((response) => {
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

  setSelectedSource(doi: string, cardInd: number) {
    this.selectedSource = doi;
    this.selectedCard = cardInd;
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

  getAvailableFormats() {
    this.clearVariables();
    this.instanceDOI = this.selectedSource;
    this._fetchDataService
      .fetchExport$(this.instanceDOI)
      .subscribe((response) => {
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
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *ngIf="this.hasDOIUrl; else elseBlock">
      <a
        style="display: flex;"
        href="javascript:void(0)"
        class="link-cite"
        (click)="open()"
      >
        <span class="cite-icon"></span>
        <span class="cite-label">Cite</span>
      </a>
    </ng-container>

    <ng-template #elseBlock>
      <div
        ngbTooltip="{{ linkTooltipText }}"
        [ngStyle]="{ width: 'fit-content' }"
      >
        <a style="display: flex;" href="javascript:void(0)">
          <span class="cite-icon inactive"></span>
          <span class="cite-label inactive">Cite</span>
        </a>
      </div>
    </ng-template>
  `,
  styleUrls: ['./bibliography.component.scss'],
})
export class BibliographyComponent {
  @Input() title = '';
  @Input() hasDOIUrl = false;
  @Input() exportData?: Record<string, any>[] = [];
  public formats: string[] = ['bibtex', 'ris', 'json_ld'];

  constructor(private modalService: NgbModal) {}
  linkTooltipText: string = CITATIONS_NOT_AVAILABLE_TOOLTIP_TEXT;

  open() {
    const modalRef = this.modalService.open(BibliographyModalContentComponent, {
      modalDialogClass: 'bibliography-dialog',
    });
    modalRef.componentInstance.formats = this.formats;

    modalRef.componentInstance.exportData = this.exportData;
  }
}
