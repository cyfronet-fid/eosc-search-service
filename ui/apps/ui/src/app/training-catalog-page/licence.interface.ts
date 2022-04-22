// Licences source URL
// https://github.com/spdx/license-list-data/blob/master/json/licenses.json

export interface ILicence {
  referenceUrl: string;
  detailsUrl: string;
  name: string;
  licenceId: string;
  seeAlso: string[];
  isOsiApproved: boolean;
  isFsfLibre: boolean;
}
