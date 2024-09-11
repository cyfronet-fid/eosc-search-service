/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { filter, first, switchMap } from 'rxjs';
import { ICollectionSearchMetadata } from '@collections/repositories/types';
import { saveAs } from 'file-saver-es';
import { CustomRoute } from '@collections/services/custom-route.service';
import { FetchDataService } from '@collections/services/fetch-data.service';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import {
  constructAdvancedSearchMetadata,
  constructStandardSearchMetadata,
} from '@pages/search-page/utils';

const DEFAULT_NO_OF_RESULTS = 2000;

@UntilDestroy()
@Component({
  selector: 'ess-download-results-button',
  template: `
    <div
      class="download-button"
      (click)="downloadResults()"
      [ngbTooltip]="'Download first 2000 results as a CSV file'"
    >
      <img
        class="download-icon"
        src="assets/download-button.svg"
        alt="download-icon"
      />
      Download Results
    </div>

    <ng-template #content let-modal>
      <div class="modal-header download-results-title">
        <h4 class="modal-title">Downloading CSV file</h4>
      </div>
      <div class="modal-body">
        <div class="container mb-4">
          <div style="text-align: center;">
            <ng-container *ngIf="modalLoading">
              <nz-spin nzSimple nzSize="large"></nz-spin>
            </ng-container>
            <ng-container *ngIf="modalError && !modalLoading">
              Failed to fetch the results. Please try again later.
            </ng-container>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .download-button {
        font-family: 'Inter', serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        color: #257b85;

        display: inline-block;
        cursor: pointer;
      }

      .download-icon {
        vertical-align: text-bottom;
        height: 20px;
      }
    `,
  ],
})
export class DownloadResultsButtonComponent {
  @ViewChild('content') content: any;
  private modalRef?: NgbModalRef;

  modalLoading = true;
  modalError = false;

  constructor(
    private _customRoute: CustomRoute,
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _modalService: NgbModal
  ) {}

  downloadResults() {
    this.modalOpen();
    this.modalLoading = true;

    this._customRoute.params$
      .pipe(
        first(),
        filter(({ collection }) => !!collection),
        switchMap((routerParams) => {
          const { collection } = routerParams;
          const metadata = this._searchMetadataRepository.get(
            collection
          ) as ICollectionSearchMetadata;

          let searchMetadata;
          let advanced;

          if (routerParams.standard.toString() === 'true') {
            searchMetadata = {
              ...constructStandardSearchMetadata(routerParams, metadata),
              rows: DEFAULT_NO_OF_RESULTS,
            };
            advanced = false;
          } else {
            searchMetadata = {
              ...constructAdvancedSearchMetadata(routerParams, metadata),
              rows: DEFAULT_NO_OF_RESULTS,
            };
            advanced = true;
          }

          return this._fetchDataService.downloadResults$(
            searchMetadata,
            advanced,
            metadata.facets
          );
        })
      )
      .subscribe({
        next: (csv_data: ArrayBuffer) => {
          const fileName = 'results.csv';
          const blob = new Blob([csv_data], { type: 'text/csv' });

          saveAs(blob, fileName);
        },
        error: () => {
          this.modalLoading = false;
          this.modalError = true;
        },
        complete: () => this.modalClose(),
      });
  }

  modalOpen() {
    this.modalRef = this._modalService.open(this.content, {
      centered: true,
    });
  }

  modalClose() {
    this.modalRef?.close();
  }
}
