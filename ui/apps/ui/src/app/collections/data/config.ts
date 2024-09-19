import { ITermsFacetParam } from '@collections/repositories/types';

export const DATE_FORMAT = 'DD MMMM YYYY';

export const DEFAULT_FACET: { [field: string]: ITermsFacetParam } = {
  title: { field: 'title', type: 'terms', limit: 0 },
};
export const DEFAULT_QF =
  'title^100 author_names_tg^120 description^10 keywords_tg^10 tag_list_tg^10';

export const PROVIDER_QF =
  'title^100 abbreviation^100 description^10 scientific_domains^10';

export const CATALOGUE_QF =
  'title^100 abbreviation^100 description^10 keywords_tg^10';

export const PROJECT_QF =
  'title^100 abbreviation^100 description^10 keywords_tg^10';

export const ORGANISATION_QF = 'alternative_names title abbreviation';

export const PL_CONTEXT_COLLECTIONS = [
  'all_collection',
  'dataset',
  'publication',
  'service',
  'data_source',
  'provider',
];

export const EU_CONTEXT_COLLECTIONS = [
  'all_collection',
  'bundle',
  'catalogue',
  'data_source',
  'dataset',
  'guideline',
  'organisation',
  'other_rp',
  'project',
  'provider',
  'publication',
  'service',
  'software',
  'training',
];

export const SPECIAL_COLLECTIONS = [
  'organisation',
  'provider',
  'project',
  'catalogue',
];

export const BETA_ONLY_COLLECTIONS = ['organisation', 'project'];

export const NO_RECOMMENDATIONS_COLLECTIONS = [
  'guideline',
  'provider',
  'bundle',
  'data_source',
  'organisation',
  'project',
  'catalogue',
];

export const HORIZONTAL_TOOLTIP_TEXT =
  'Horizontal Services are services potentially useful for all researchers' +
  ', no matter their affiliation nor scientific discipline. Usually provided' +
  ' by computing centers and e-Infrastructures. They bring an additional value' +
  ' to service providers and developers, who want to enhance their services with' +
  ' new capabilities like computing or storage.';

export const DATASOURCE_FILTER_TOOLTIP_TEXT =
  'The list provided in this filter does not include of all the data sources published in EOSC, ' +
  'only those harvested in OpenAIRE Research Graph. Such data sources make their research products ' +
  'discoverable and available in EOSC.';

export const SDG_TOOLTIP_TEXT =
  'The Sustainable Development Goals is a collection of seventeen interlinked ' +
  'objectives designed to achieve a better and more sustainable future for all.' +
  ' They address the global challenges we face, including poverty, inequality, ' +
  'climate change, environmental degradation, peace, and justice.';

export const RECOMMENDATIONS_TOOLTIP_TEXT_NOTLOGGED =
  'Not Logged In? Discover Trending Picks: Recommended ' +
  "resources reflect what's popular among other users " +
  'right now. Log in to access personalized suggestions ' +
  'curated just for you, influenced by your interests ' +
  'and actions on the EOSC Platform';

export const RECOMMENDATIONS_TOOLTIP_TEXT_LOGGED =
  'A recommender system suggests resources - like data sets, ' +
  'publications, software, trainings, and more. ' +
  'It looks at your past orders, views, and interactions. ' +
  'It also considers what others with similar interests ' +
  'have engaged with. The more you explore, the smarter ' +
  'the suggestions get. Your journey shapes your suggestions!';

export const CITATIONS_NOT_AVAILABLE_TOOLTIP_TEXT =
  'Due to the lack of data, bibliography record’s generation is not possible. ' +
  'Please check the other sources of this file ' +
  'or a source website to check if the link is valid.';

export const BIBLIOGRAPHY_TOOLTIP_TEXT =
  ' If some links or buttons are not active, it means that this source ' +
  'does not provide us with the required information to generate the required format. ' +
  'Please also check other sources If possible.';

export const INTEROPERABILITY_PATTERNS_TOOLTIP_TEXT =
  'With interoperability patterns you are able to discover research products ' +
  'along with processing tools dedicated for them.';

export const ACTIVE_WITHIN_TOOLTIP_TEXT =
  'Atcive within - Filters projects actively ongoing within selected years, ' +
  'including also those that started before the range and extend beyond it. ' +
  'The beginning or end of the project must always fall within the selected range.';

// Source: http://country.io/data/
export const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  BD: 'Bangladesh',
  BE: 'Belgium',
  BF: 'Burkina Faso',
  BG: 'Bulgaria',
  BA: 'Bosnia and Herzegovina',
  BB: 'Barbados',
  WF: 'Wallis and Futuna',
  BL: 'Saint Barthelemy',
  BM: 'Bermuda',
  BN: 'Brunei',
  BO: 'Bolivia',
  BH: 'Bahrain',
  BI: 'Burundi',
  BJ: 'Benin',
  BT: 'Bhutan',
  JM: 'Jamaica',
  BV: 'Bouvet Island',
  BW: 'Botswana',
  WS: 'Samoa',
  BQ: 'Bonaire, Saint Eustatius and Saba ',
  BR: 'Brazil',
  BS: 'Bahamas',
  JE: 'Jersey',
  BY: 'Belarus',
  BZ: 'Belize',
  RU: 'Russia',
  RW: 'Rwanda',
  RS: 'Serbia',
  TL: 'East Timor',
  RE: 'Reunion',
  TM: 'Turkmenistan',
  TJ: 'Tajikistan',
  RO: 'Romania',
  TK: 'Tokelau',
  GW: 'Guinea-Bissau',
  GU: 'Guam',
  GT: 'Guatemala',
  GS: 'South Georgia and the South Sandwich Islands',
  GR: 'Greece',
  GQ: 'Equatorial Guinea',
  GP: 'Guadeloupe',
  JP: 'Japan',
  GY: 'Guyana',
  GG: 'Guernsey',
  GF: 'French Guiana',
  GE: 'Georgia',
  GD: 'Grenada',
  GB: 'United Kingdom',
  GA: 'Gabon',
  SV: 'El Salvador',
  GN: 'Guinea',
  GM: 'Gambia',
  GL: 'Greenland',
  GI: 'Gibraltar',
  GH: 'Ghana',
  OM: 'Oman',
  TN: 'Tunisia',
  JO: 'Jordan',
  HR: 'Croatia',
  HT: 'Haiti',
  HU: 'Hungary',
  HK: 'Hong Kong',
  HN: 'Honduras',
  HM: 'Heard Island and McDonald Islands',
  VE: 'Venezuela',
  PR: 'Puerto Rico',
  PS: 'Palestinian Territory',
  PW: 'Palau',
  PT: 'Portugal',
  SJ: 'Svalbard and Jan Mayen',
  PY: 'Paraguay',
  IQ: 'Iraq',
  PA: 'Panama',
  PF: 'French Polynesia',
  PG: 'Papua New Guinea',
  PE: 'Peru',
  PK: 'Pakistan',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PM: 'Saint Pierre and Miquelon',
  ZM: 'Zambia',
  EH: 'Western Sahara',
  EE: 'Estonia',
  EG: 'Egypt',
  ZA: 'South Africa',
  EC: 'Ecuador',
  IT: 'Italy',
  VN: 'Vietnam',
  SB: 'Solomon Islands',
  ET: 'Ethiopia',
  SO: 'Somalia',
  ZW: 'Zimbabwe',
  SA: 'Saudi Arabia',
  ES: 'Spain',
  ER: 'Eritrea',
  ME: 'Montenegro',
  MD: 'Moldova',
  MG: 'Madagascar',
  MF: 'Saint Martin',
  MA: 'Morocco',
  MC: 'Monaco',
  UZ: 'Uzbekistan',
  MM: 'Myanmar',
  ML: 'Mali',
  MO: 'Macao',
  MN: 'Mongolia',
  MH: 'Marshall Islands',
  MK: 'Macedonia',
  MU: 'Mauritius',
  MT: 'Malta',
  MW: 'Malawi',
  MV: 'Maldives',
  MQ: 'Martinique',
  MP: 'Northern Mariana Islands',
  MS: 'Montserrat',
  MR: 'Mauritania',
  IM: 'Isle of Man',
  UG: 'Uganda',
  TZ: 'Tanzania',
  MY: 'Malaysia',
  MX: 'Mexico',
  IL: 'Israel',
  FR: 'France',
  IO: 'British Indian Ocean Territory',
  SH: 'Saint Helena',
  FI: 'Finland',
  FJ: 'Fiji',
  FK: 'Falkland Islands',
  FM: 'Micronesia',
  FO: 'Faroe Islands',
  NI: 'Nicaragua',
  NL: 'Netherlands',
  NO: 'Norway',
  NA: 'Namibia',
  VU: 'Vanuatu',
  NC: 'New Caledonia',
  NE: 'Niger',
  NF: 'Norfolk Island',
  NG: 'Nigeria',
  NZ: 'New Zealand',
  NP: 'Nepal',
  NR: 'Nauru',
  NU: 'Niue',
  CK: 'Cook Islands',
  XK: 'Kosovo',
  CI: 'Ivory Coast',
  CH: 'Switzerland',
  CO: 'Colombia',
  CN: 'China',
  CM: 'Cameroon',
  CL: 'Chile',
  CC: 'Cocos Islands',
  CA: 'Canada',
  CG: 'Republic of the Congo',
  CF: 'Central African Republic',
  CD: 'Democratic Republic of the Congo',
  CZ: 'Czech Republic',
  CY: 'Cyprus',
  CX: 'Christmas Island',
  CR: 'Costa Rica',
  CW: 'Curacao',
  CV: 'Cape Verde',
  CU: 'Cuba',
  SZ: 'Swaziland',
  SY: 'Syria',
  SX: 'Sint Maarten',
  KG: 'Kyrgyzstan',
  KE: 'Kenya',
  SS: 'South Sudan',
  SR: 'Suriname',
  KI: 'Kiribati',
  KH: 'Cambodia',
  KN: 'Saint Kitts and Nevis',
  KM: 'Comoros',
  ST: 'Sao Tome and Principe',
  SK: 'Slovakia',
  KR: 'South Korea',
  SI: 'Slovenia',
  KP: 'North Korea',
  KW: 'Kuwait',
  SN: 'Senegal',
  SM: 'San Marino',
  SL: 'Sierra Leone',
  SC: 'Seychelles',
  KZ: 'Kazakhstan',
  KY: 'Cayman Islands',
  SG: 'Singapore',
  SE: 'Sweden',
  SD: 'Sudan',
  DO: 'Dominican Republic',
  DM: 'Dominica',
  DJ: 'Djibouti',
  DK: 'Denmark',
  VG: 'British Virgin Islands',
  DE: 'Germany',
  YE: 'Yemen',
  DZ: 'Algeria',
  US: 'United States',
  UY: 'Uruguay',
  YT: 'Mayotte',
  UM: 'United States Minor Outlying Islands',
  LB: 'Lebanon',
  LC: 'Saint Lucia',
  LA: 'Laos',
  TV: 'Tuvalu',
  TW: 'Taiwan',
  TT: 'Trinidad and Tobago',
  TR: 'Turkey',
  LK: 'Sri Lanka',
  LI: 'Liechtenstein',
  LV: 'Latvia',
  TO: 'Tonga',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LR: 'Liberia',
  LS: 'Lesotho',
  TH: 'Thailand',
  TF: 'French Southern Territories',
  TG: 'Togo',
  TD: 'Chad',
  TC: 'Turks and Caicos Islands',
  LY: 'Libya',
  VA: 'Vatican',
  VC: 'Saint Vincent and the Grenadines',
  AE: 'United Arab Emirates',
  AD: 'Andorra',
  AG: 'Antigua and Barbuda',
  AF: 'Afghanistan',
  AI: 'Anguilla',
  VI: 'U.S. Virgin Islands',
  IS: 'Iceland',
  IR: 'Iran',
  AM: 'Armenia',
  AL: 'Albania',
  AO: 'Angola',
  AQ: 'Antarctica',
  AS: 'American Samoa',
  AR: 'Argentina',
  AU: 'Australia',
  AT: 'Austria',
  AW: 'Aruba',
  IN: 'India',
  AX: 'Aland Islands',
  AZ: 'Azerbaijan',
  IE: 'Ireland',
  ID: 'Indonesia',
  UA: 'Ukraine',
  QA: 'Qatar',
  MZ: 'Mozambique',
};
export const NOT_SPECIFIED_LANG = 'Not specified';
export const DATASOURCE_PID_MAPPING: Record<string, string> = {
  'eosc.000-test-pg.00-new-new': '00 New Datasource',
  'eosc.acdh-ch.arche': 'ARCHE. A Resource Centre for the HumanitiEs',
  'eosc.athena_rc_2.narcis': 'NARCIS',
  'eosc.awi_bremerhaven.pangaea':
    'PANGAEA - Data Publisher for Earth & Environmental Science',
  'eosc.bbmri-eric.bbmri-eric_crc-cohort':
    'BBMRI-ERIC Colorectal Cancer Cohort data set',
  'eosc.bbmri-eric.bbmri-eric_directory':
    'BBMRI-ERIC Directory of biobanks and their collections in the BBMRI-ERIC member states',
  'eosc.blue-cloud.grsf': 'Global Record of Stocks and Fisheries',
  'eosc.ccsd.episciences': 'Episciences',
  'eosc.ceric-eric.ceric-data-portal': 'CERIC Data Portal',
  'eosc.cern.cod': 'CERN Open Data Portal',
  'eosc.cessda-eric.cdc': 'CESSDA Data Catalogue',
  'eosc.clarin-eric.virtual_language_observatory':
    'Virtual Language Observatory update',
  'eosc.cnr_-_isti.isti_open_portal': 'ISTI Open Portal',
  'eosc.csuc.corardr': 'CORA.Repositori de Dades de Recerca',
  'eosc.ct3.tb8_2': 'TEST beta 8.11_2',
  'eosc.ct3.ts_2711': 'Test Service KL_27.11_12:30',
  'eosc.cyfronet.check-it-out': 'Cyfro Datasource',
  'eosc.cyfronet.new_datasource_test-cyfronet_10':
    'new datasource Test-Cyfronet #10',
  'eosc.cyfronet.rodbuk': 'RODBUK Cracow Open Research Data Repository',
  'eosc.dkrz.wdcc': 'WDCC World Data Center for Climate',
  'eosc.elixir-uk.workflowhub': 'WorkflowHub',
  'eosc.embl-ebi.icr': 'Identifiers.org Central Registry',
  'eosc.esrf.tesrfdp':
    'The European Synchrotron Radiation Facility Data Portal',
  'eosc.eudat.b2find': 'B2FIND',
  'eosc.eudat.b2safe': 'B2SAFE',
  'eosc.eudat.b2share': 'B2SHARE',
  'eosc.fris.fris': 'Flemish Research Information Space',
  'eosc.gbif.gbif_species_occurrence_data': 'GBIF Species Occurrence Data',
  'eosc.gdansk_tech.most': 'Most Wiedzy Open Research Data Catalog',
  'eosc.gwdg.textgrid_repository': 'TextGrid Repository',
  'eosc.hits.fairdomhub': 'FAIRDOMHub',
  'eosc.hn.isidore': 'ISIDORE',
  'eosc.icos_eric.data_discovery_and_access_portal':
    'Integrated Carbon Observation System Data Portal',
  'eosc.ill.ill_data_portal': 'ILL Data Portal',
  'eosc.inria.software_heritage_archive': 'Software Heritage archive',
  'eosc.ku_leuven.ku_leuven_rdr': 'KU Leuven RDR',
  'eosc.ku_leuven.lirias':
    'Leuven Institutional Repository and Information Archiving System(LIRIAS)',
  'eosc.lapp.ossr': 'Open-source Scientific Software and Service Repository',
  'eosc.lida.lida_survey_data': 'LiDA Dataverse Collection of the Survey Data',
  'eosc.lindatclariah-cz.lindatclariah-cz_repository':
    'LINDAT/CLARIAH-CZ Repository',
  'eosc.lindatclariah-cz.lindatclariah-cz_repository+invalid':
    'LINDAT/CLARIAH-CZ Repository for Language Technologies, Arts and Humanities',
  'eosc.obsparis.padc': 'Paris Astronomical Data Centre',
  'eosc.obsparis.vespa_query_portal':
    'VESPA (Virtual European Solar and Planetary Access) query portal',
  'eosc.openaire.openaire_scholexplorer': 'OpenAIRE ScholeXplorer',
  'eosc.openaire.zenodo': 'Zenodo',
  'eosc.oxford_e-research_centre.fairsharing': 'FAIRsharing',
  'eosc.provider_1205.datasource_1205': 'Datasource 12.05',
  'eosc.provider_1205.dataspurce_2_1205': 'datasource 2 12.05',
  'eosc.provider_13112023.service_13112023': 'Service 13.11.2023',
  'eosc.provider_17102023-1.service_18102023-1': 'service 18.10.2023-1',
  'eosc.provider_20102023.service_25102023-1': 'Service 25.10.2023-1 update',
  'eosc.provider_20102023.service_for_provider_20102023':
    'Service for Provider 20.10.2023',
  'eosc.provider_20112023.service_20112023': 'Service 20.11.2023',
  'eosc.provider_212.provider_212_datasource': 'Provider 2.12 datasource',
  'eosc.provider_2309.test_d': 'test d',
  'eosc.provider_2309_3.new_datasource_2410': 'new datasource 24.10',
  'eosc.provider_2309_3.test_2': 'Test 2',
  'eosc.provider_23102023.service_23102023': 'Service 23.10.2023',
  'eosc.provider_23102023.service_23102023-2': 'Service 23.10.2023-2',
  'eosc.provider_23112023.service_23112023': 'Service 23.11.2023 update 22',
  'eosc.provider_23112023.service_23112023_-_3':
    'Service 23.11.2023 - 3 update 1',
  'eosc.provider_30112023.service_30112023': 'Service 30.11.2023',
  'eosc.provider_30112023.service_30112023_-_2': 'Service 30.11.2023 - 2',
  'eosc.provider_7102023.service_7112023': 'Service 7.11.2023',
  'eosc.provider_711.datasource_provider_711': 'Datasource Provider 7.11',
  'eosc.provider_8112023-3.service_8112023': 'Service 8.11.2023 - 11:46',
  'eosc.provider_8112023-3.service_8112023_-_1156': 'Service 8.11.2023 - 11:56',
  'eosc.psi.psi_public_data_repository': 'PSI Public Data Repository',
  'eosc.psnc.rohub': 'ROHub',
  'eosc.riga_stradins_university.rsu_dataverse': 'RSU Dataverse',
  'eosc.rli.open_energy_platform': 'Open Energy Platform',
  'eosc.ror-org.ror': 'Research Organization Registry (ROR)',
  'eosc.scipedia.spaosp': 'Scientific publishing and Open Science Platform',
  'eosc.seadatanet.european_directory_of_marine_environmental_data_edmed':
    'SeaDataNet European Directory of Marine Environmental Data (EDMED)',
  'eosc.seadatanet.european_directory_of_marine_environmental_research_projects':
    'SeaDataNet European Directory of Marine Environmental Research Projects (EDMERP)',
  'eosc.seadatanet.european_directory_of_marine_organisations_edmo':
    'SeaDataNet European Directory of Marine Organisations (EDMO)',
  'eosc.seadatanet.european_directory_of_the_cruise_summary_reports_csr':
    'SeaDataNet European Directory of the Cruise Summary Reports (CSR)',
  'eosc.seadatanet.european_directory_of_the_initial_ocean-observing_systems_edios':
    'SeaDataNet European Directory of the Initial Ocean-Observing Systems (EDIOS)',
  'eosc.seadatanet.marine_data_viewer':
    'Marine Data Viewer displaying in-situ measurements of essential ocean variables co-located with model and satellite products',
  'eosc.seadatanet.seadatanet_cdi':
    'SeaDataNet Common Data Index (CDI) user interface',
  'eosc.seadatanet.seadatanet_cdi_ogc_wfs':
    'SeaDataNet CDI Data Discovery & Access service: OGC WFS service for metadata features of all data sets (open and restricted)',
  'eosc.seadatanet.seadatanet_cdi_ogc_wms':
    'SeaDataNet CDI Data Discovery & Access service: OGC WMS service for locations of all data sets (open and restricted)',
  'eosc.seadatanet.seadatanet_cdi_sparql':
    'SeaDataNet CDI Data Discovery & Access service: SPARQL service for CDI metadata (open data)',
  'eosc.seadatanet.webodv':
    'WebODV - Online extraction, analysis and visualization of SeaDataNet and Argo data',
  'eosc.sobigdata.sbdliteracy': 'SoBigData Literacy Catalogue',
  'eosc.sobigdata.sbdservicesandproducts':
    'SoBigData Services and Products Catalogue',
  'eosc.srce-2.srce-repo': 'Digital repository of SRCE',
  'eosc.test-pg.00-test-pg': '00TestPG',
  'eosc.uit.trolling':
    'The Tromsø Repository of Language and Linguistics (TROLLing)',
  'eosc.unibi-ub.base': 'Bielefeld Academic Search Engine (BASE)',
  'eosc.unibi-ub.pub': 'Publications at Bielefeld University',
  'eosc.unipd.rdu': 'Research Data Unipd',
  'eosc.uniwersytet_opolski.bk_uniopole':
    'University of Opole Base of Knowledge',
  'eosc.vamdc.vamdc_portal': 'VAMDC Portal',
  'eosc.vilnius-university.tnoarda':
    'The National Open Access Research Data Archive (MIDAS)',
  'eosc.vliz.worms': 'World Register of Marine Species',
  'eosc.wenmr.madomsi3sobm':
    'MetalPDB: a database of metal-binding sites in 3D structures of biological macromolecules',
  'eosc.zpid.psycharchives': 'PsychArchives',
  'ni4os.fcub.cherry': 'CHERRY - CHEmistry RepositoRY',
  'ni4os.ibiss.ibiss_radar':
    'RADaR - Digital Repository of Archived Publications of the Institute for Biological Research',
  'ni4os.ichtm.cer':
    'CeR - Central Repository of the Institute of Chemistry, Technology and Metallurgy',
  'ni4os.sanu.dais':
    'DAIS - Digital Archive of the Serbian Academy of Sciences and Arts',
};
export const CATALOGUE_NAME_MAPPING: Record<string, string> = {
  eosc: 'EOSC',
  escape_ossr: 'ESCAPE OSSR',
  ni4os:
    'National Initiatives for Open Science in Europe – NI4OS Europe  Catalogue',
  'eosc-nordic': 'EOSC Nordic Service Gateway',
};
