import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

interface IInteroperabilityGuidelines {
  author_names: string[];
  author_names_tg: string[];
  author_types: string[];
  description: string[];
  doi: string[] | null;
  domain: null;
  eosc_guideline_type: string;
  eosc_integration_options: string[];
  eosc_related_standards: any[];
  id: string;
  publication_date: string;
  publication_year: number;
  right_id: string[];
  right_title: string[];
  right_uri: string[];
  status: string;
  title: string[];
  type: string;
  type_info: string[];
  updated_at: string;
}

@Component({
  selector: 'ess-interoperability-page',
  templateUrl: './interoperability-page.component.html',
  styleUrls: ['./interoperability-page.component.scss'],
})
export class InteroperabilityPageComponent {
  // TODO: example of data
  public list: Array<IInteroperabilityGuidelines> = [
    {
      author_names: ['KIT'],
      author_names_tg: ['KIT'],
      author_types: ['Organisational'],
      description: [
        '"The EOSC Helpdesk https://eosc-helpdesk.eosc-portal.eu is the entry point and ticketing system/request tracker for issues concerning the available EOSC services. It implements incident and service request management and provides efficient communication channels between users and providers of the IT resources and services. The EOSC Helpdesk provides several capabilities, which were identified during requirement analysis, such as self-service, reporting and notifications; it helps ensure the integrity of the IT infrastructure and quality of the delivered services. In the EOSC Future project, the Helpdesk is implemented as a distributed multi-tenant system that can be used for  efficient  support  of  the  EOSC-Core Technical  Platform  and  the  EOSC-Exchange  services.  The  EOSC Helpdesk  is  offered  to  EOSC  Providers as  a  service  to  enable  dedicated  support  for  users  of  their  services.  To achieve  this  goal,  the  EOSC  Helpdesk  supports  different  levels  of  integration  with  Helpdesk  components, described in the section High-level Service Architecture.\nThis EOSC-Core Interoperability Guideline is intended for the technical experts of service and resource providers that would like their services and/or resources to be interoperable or integrate with EOSC Core Services. \n"',
      ],
      doi: ['10.5281/zenodo.7308617'],
      domain: null,
      eosc_guideline_type:
        'ir_eosc_guideline_type-eosc_core_interoperability_guideline',
      eosc_integration_options: [],
      eosc_related_standards: [],
      id: '56d1d77d70bf50d16a70407c8bb1c938',
      publication_date: '2022-11-28T10:34:47',
      publication_year: 2022,
      right_id: ['CC-BY-4.0'],
      right_title: [
        'This work by Parties of the EOSC Future Consortium is licensed under a Creative Commons Attribution 4.0 International License The EOSC Future project is co-funded by the European Union Horizon Programme call INFRAEOSC-03-2020, Grant Agreement number 101017536. ',
      ],
      right_uri: ['https://docs.zammad.org/en/latest/about/zammad.html'],
      status: 'ir_status-proposed',
      title: ['EOSC Helpdesk: Architecture and Interoperability Guidelines'],
      type: 'interoperability guideline',
      type_info: [
        'Interoperability Guideline: intended for Providers of EOSC Resources for the purposes of understanding how to interoperate with this EOSC-Core Service',
      ],
      updated_at: '2022-11-28T10:34:47',
    },
    {
      author_names: ['EOSC Future WP4'],
      author_names_tg: ['EOSC Future WP4'],
      author_types: ['Organisational'],
      description: [
        'EOSC Resource Catalogue is the heart of the EOSC Future ecosystem. It provides both data and functionality to register, maintain, administer and share resources onboarded by various providers. Moreover, it’s the point of reference for all EOSC Future components that provide added value to this information and help in making all this data and services searchable and accessible using various tools, both for researchers and end users.',
      ],
      doi: null,
      domain: null,
      eosc_guideline_type:
        'ir_eosc_guideline_type-eosc_core_interoperability_guideline',
      eosc_integration_options: [],
      eosc_related_standards: [],
      id: 'a58891887a0850d691ed8f29036f40f9',
      publication_date: '2022-11-28T10:40:35',
      publication_year: 2022,
      right_id: ['CC-BY-4.0'],
      right_title: [
        'This work by Parties of the EOSC Future Consortium is licensed under a Creative Commons Attribution 4.0 International License The EOSC Future project is co-funded by the European Union Horizon Programme call INFRAEOSC-03-2020, Grant Agreement number 101017536.',
      ],
      right_uri: [
        'https://technopolisltd223.sharepoint.com/:w:/r/sites/INFRAEOSC-03Proposal/_layouts/15/doc2.aspx?sourcedoc=%7B99AD09AC-8B1C-4A82-B2F8-734CB41689C4%7D&file=EOSC%20Resource%20Catalogue%20Interoperability%20Guideline.docx&action=default&mobileredirect=true&cid=ccc04f49-5ee4-431b-bfa2-8042bcfeead8',
      ],
      status: 'ir_status-proposed',
      title: [
        'EOSC Resource Catalogue: Architecture and Interoperability Guidelines',
      ],
      type: 'interoperability guideline',
      type_info: [
        'Interoperability Guideline: intended for Providers of EOSC products regarding products publishing and management, Resource Catalogue onboarding and synchronization, resource graph maintenance, and interoperations with other EOSC Future components, such as Marketplace etc.',
      ],
      updated_at: '2023-02-03T09:38:07',
    },
    {
      author_names: ['GRNET'],
      author_names_tg: ['GRNET'],
      author_types: ['Organisational'],
      description: [
        '"Monitoring is the key service needed to gain insights into an infrastructure. It needs to be continuous and on-demand to quickly detect, correlate, and analyse data for a fast reaction to anomalous behaviour. The challenge of this type of monitoring is how to quickly identify and correlate problems before they affect end-users and ultimately the productivity of the organisation. Management teams can monitor the availability and reliability of the services from a high level view down to individual system metrics and monitor the conformance of multiple SLAs.\nThe EOSC Monitoring service combines two operational monitoring services: the EOSC-CORE and the EOSC-Exchange Monitoring Services, Respectively monitoring the EOSC-Core services (EOSC Core Monitoring) and the services onboarded to the Marketplace (EOSC-Exchange Monitoring).\nThe EOSC Monitoring services were implemented adopting the ARGO technology.\n"',
      ],
      doi: ['10.5281/zenodo.7118591'],
      domain: null,
      eosc_guideline_type:
        'ir_eosc_guideline_type-eosc_core_interoperability_guideline',
      eosc_integration_options: [
        'Integration Option 1: Monitor an Onboarded Service ',
        'Integration Option 2: Monitor an Infrastructure',
        'Integration Option 3: Integrate  External  Monitoring  service',
        'Integration Option 4: Combine Results of existing ARGO Tenants',
        'Integration Option  5: Third-party services exploiting EOSC Monitoring data',
      ],
      eosc_related_standards: [],
      id: '558a4019b952ce116f6b7dd2e8661f41',
      publication_date: '2022-11-28T10:27:25',
      publication_year: 2022,
      right_id: ['CC-BY-4.0'],
      right_title: [
        'This work by Parties of the EOSC Future Consortium is licensed under a Creative Commons Attribution 4.0 International License The EOSC Future project is co-funded by the European Union Horizon Programme call INFRAEOSC-03-2020, Grant Agreement number 101017536. ',
      ],
      right_uri: [
        'https://github.com/ARGOeu/argo-monitoring/blob/master/LICENSE',
      ],
      status: 'ir_status-proposed',
      title: ['EOSC Monitoring: Architecture and Interoperability Guidelines'],
      type: 'interoperability guideline',
      type_info: [
        'Interoperability Guideline: intended for Providers of EOSC Resources for the purposes of understanding how to interoperate with this EOSC-Core Service',
      ],
      updated_at: '2022-12-02T15:04:45',
    },
  ];

  public getIG$: Observable<IInteroperabilityGuidelines[]> = of(this.list);
}
