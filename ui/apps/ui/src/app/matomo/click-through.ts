import { IResult } from '@collections/repositories/types';

/**
 * A Click-through is a click on a Discovery Hub result that opens the
 * result's page. It is sent to Matomo as a `ClickThrough` event, filed under
 * the result's type and named by a key that stays stable over time.
 */
type NamedResult = Pick<IResult, 'id' | 'pid' | 'serviceId' | 'iid'>;

// Marketplace resources: their ESS ids are shifted by type, PIDs are stable
const byPid = (result: NamedResult) => result.pid ?? '';
// Bundle ids are random, and bundles carry no service PID
const byServiceIdAndIid = (result: NamedResult) =>
  result.serviceId != null && result.iid != null
    ? `${result.serviceId}:${result.iid}`
    : '';
const bySourceId = (result: NamedResult) => result.id;

/** Keyed by the `resource_type` of a result link */
const CLICK_THROUGHS = new Map<
  string,
  { category: string; name: (result: NamedResult) => string }
>([
  ['service', { category: 'Service', name: byPid }],
  ['data source', { category: 'DataSource', name: byPid }],
  ['data-source', { category: 'DataSource', name: byPid }],
  ['provider', { category: 'Provider', name: byPid }],
  ['catalogue', { category: 'Catalogue', name: byPid }],
  ['deployable service', { category: 'DeployableService', name: byPid }],
  ['deployable-service', { category: 'DeployableService', name: byPid }],
  ['bundle', { category: 'Bundle', name: byServiceIdAndIid }],
  ['publication', { category: 'Publication', name: bySourceId }],
  ['dataset', { category: 'Dataset', name: bySourceId }],
  ['software', { category: 'Software', name: bySourceId }],
  ['other', { category: 'OtherResearchProduct', name: bySourceId }],
  ['training', { category: 'Training', name: bySourceId }],
  ['guideline', { category: 'Guideline', name: bySourceId }],
  ['adapter', { category: 'Adapter', name: bySourceId }],
  ['project', { category: 'Project', name: bySourceId }],
  ['organisation', { category: 'Organisation', name: bySourceId }],
]);

/** The event category for a link's `resource_type`; undefined if unknown */
export const clickThroughCategory = (
  resourceType: string | null
): string | undefined =>
  resourceType === null
    ? undefined
    : CLICK_THROUGHS.get(resourceType)?.category;

/** The event name for a result, or '' when it has nothing stable to use */
export const clickThroughName = (
  result: NamedResult & Pick<IResult, 'type'>
): string => CLICK_THROUGHS.get(result.type.value)?.name(result) ?? '';
