// Licences source URL
// https://github.com/spdx/license-list-data/blob/master/json/licenses.json

import * as licencesJSON from './licences.json';

export const licences = (licencesJSON as unknown as { default: unknown })
  .default as ILicence[];

export interface ILicence {
  referenceUrl: string;
  detailsUrl: string;
  name: string;
  id: string;
  seeAlso: string[];
  isOsiApproved: boolean;
  isFsfLibre: boolean;
}
