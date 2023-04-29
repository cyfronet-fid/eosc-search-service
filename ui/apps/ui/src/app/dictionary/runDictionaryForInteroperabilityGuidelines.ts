import { interoperabilityGuidelinesStatusDictionary } from '../dictionary/interoperabilityGuidelinesStatusDictionary';
import { interoperabilityGuidelinesTypeDictionary } from '../dictionary/interoperabilityGuidelinesTypeDictionary';
import { interoperabilityGuidelinesDomainDictionary } from '../dictionary/interoperabilityGuidelinesDomainDictionary';

export function runDictionaryForInteroperabilityGuidelines(
  type: string,
  value: string
) {
  switch (type) {
    case 'domain':
      return interoperabilityGuidelinesDomainDictionary[value] || '-';
      break;
    case 'status':
      return interoperabilityGuidelinesStatusDictionary[value] || '-';
      break;
    case 'eosc_guideline_type':
      return interoperabilityGuidelinesTypeDictionary[value] || '-';
      break;
    default:
      return value;
  }
}
