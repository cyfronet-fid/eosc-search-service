import { Component, Input, OnInit } from '@angular/core';
import { DEFAULT_COLLECTION_ID } from '@collections/data';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';

@Component({
  selector: 'ess-organisation-result',
  templateUrl: './organisation-result.component.html',
  styleUrls: [
    './result.component.scss',
    './result-ui-controls/show-related-resources.scss',
  ],
})
export class OrganisationResultComponent implements OnInit {
  @Input() id!: string;
  @Input() title!: string;
  @Input() country = '';
  @Input() website = '';
  @Input() relatedPublicationNumber: number = 0;
  @Input() relatedSoftwareNumber: number = 0;
  @Input() relatedDatasetNumber: number = 0;
  @Input() relatedOtherNumber: number = 0;
  @Input() relatedProjectNumber: number = 0;
  public hasResources: boolean = false;
  public url = '';

  getRedirectUrl(value: string) {
    if (value === 'project') {
      const fqs = `fq=related_organisation_titles:"${this.title}"`;
      window.open(`${SEARCH_PAGE_PATH}/project?q=*&${fqs}`);
    } else {
      const fqs = `fq=related_organisation_titles:"${this.title}"&fq=type:"${value}"`;
      window.open(`${SEARCH_PAGE_PATH}/${DEFAULT_COLLECTION_ID}?q=*&${fqs}`);
    }
  }

  ngOnInit() {
    this.hasResources =
      this.relatedDatasetNumber > 0 ||
      this.relatedOtherNumber > 0 ||
      this.relatedSoftwareNumber > 0 ||
      this.relatedPublicationNumber > 0;
  }
}
