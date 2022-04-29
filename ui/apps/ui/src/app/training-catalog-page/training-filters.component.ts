import { Component } from '@angular/core';
import { IMultiselectWithSearchParams } from '@ui/core';
import {
  accessCost,
  accessRight,
  expertiseLevel,
} from './training-fields.types';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import * as trainingsJSON from './training-catalog-data.mock.json';
import { ITraining } from './training.interface';

import * as hash from 'object-hash';
import { languages } from './language.interface';
import { licences } from './licence.interface';
import { licencesIds } from './licences-ids.data';

@Component({
  selector: 'ui-training-filters',
  template: `<section class="dashboard__filter">
    <h5>Filters</h5>
    <core-multiselect-with-search [filter]="authors">
    </core-multiselect-with-search>
    <core-multiselect-with-search [filter]="languages">
    </core-multiselect-with-search>
    <core-multiselect-with-search [filter]="keywords">
    </core-multiselect-with-search>
    <core-multiselect-with-search [filter]="licences">
    </core-multiselect-with-search>
    <h6 class="text-secondary">Access Rights</h6>
    <nz-radio-group [(ngModel)]="accessRight">
      <label
        *ngFor="let availableAccessRights of accessRights"
        nz-radio-button
        [nzValue]="availableAccessRights?.key"
        ><span>{{ availableAccessRights?.title }}</span></label
      >
    </nz-radio-group>
    <core-multiselect-with-search [filter]="formats">
    </core-multiselect-with-search>
    <core-multiselect-with-search [filter]="targetGroups">
    </core-multiselect-with-search>
    <core-multiselect-with-search [filter]="organizations">
    </core-multiselect-with-search>
    <h6 class="text-secondary">Rating</h6>
    <ngb-rating [max]="5" [rate]="0"> </ngb-rating>
    <h6 class="text-secondary">Learning resource type</h6>
    <h6 class="text-secondary">Learning outcomes</h6>
    <h6 class="text-secondary">Access cost</h6>
    <nz-radio-group [(ngModel)]="accessCost">
      <label
        *ngFor="let availableAccessCost of accessCosts"
        nz-radio-button
        [nzValue]="availableAccessCost?.key"
        ><span>{{ availableAccessCost?.title }}</span></label
      >
    </nz-radio-group>
    <h6 class="text-secondary">Expertise level</h6>
    <nz-radio-group [(ngModel)]="expertiseLevel">
      <label
        *ngFor="let availableExpertiseLevels of expertiseLevels"
        nz-radio-button
        [nzValue]="availableExpertiseLevels?.key"
        ><span>{{ availableExpertiseLevels?.title }}</span></label
      >
    </nz-radio-group>
  </section> `,
})
export class TrainingFiltersComponent {
  trainings = (trainingsJSON as unknown as { default: unknown })
    .default as ITraining[];

  authors: IMultiselectWithSearchParams = {
    label: 'Authors',
    buckets: [...new Set(this.trainings.map((training) => training.author))]
      .map((author) => ({
        key: author.replace(' ', '-').toLowerCase(),
        title: author,
        isLeaf: true,
      }))
      .slice(0, 10),
  };
  languages: IMultiselectWithSearchParams = {
    label: 'Languages',
    buckets: Object.keys(languages)
      .map((languageAlphaCode2) => ({
        key: languageAlphaCode2,
        title: `${languages[languageAlphaCode2].nativeName} (${languages[languageAlphaCode2].name})`,
        isLeaf: true,
      }))
      .slice(0, 10),
  };
  keywords: IMultiselectWithSearchParams = {
    label: 'Keywords',
    buckets: [{ key: 'none', title: 'None', isLeaf: true }],
  };
  licences: IMultiselectWithSearchParams = {
    label: 'Licences',
    buckets: licences
      .map((licence) => ({
        key: licence.id,
        title: licence.name,
        isLeaf: true,
      }))
      .slice(0, 10),
  };
  accessRight: accessRight = 'open';
  accessRights: NzTreeNodeOptions[] = [
    {
      key: 'open',
      title: 'Open',
    },
    {
      key: 'closed',
      title: 'Closed',
    },
    {
      key: 'restricted',
      title: 'Restricted',
    },
    {
      key: 'with-a-cost',
      title: 'With a cost',
    },
  ];
  formats: IMultiselectWithSearchParams = {
    label: 'Formats',
    buckets: [
      ...new Set(this.trainings.map((training) => training.format)),
    ].map((format) => ({
      key: format.toLowerCase(),
      title: format,
      isLeaf: true,
    })),
  };
  targetGroups: IMultiselectWithSearchParams = {
    label: 'Target groups',
    buckets: [
      ...new Set(this.trainings.map((training) => training.targetGroup)),
    ].map((targetGroup) => ({
      key: targetGroup.toLowerCase(),
      title: targetGroup,
      isLeaf: true,
    })),
  };
  organizations: IMultiselectWithSearchParams = {
    label: 'Organizations',
    buckets: [
      ...new Set(this.trainings.map((training) => training.organization)),
    ]
      .map((organization) => ({
        key: organization.toLowerCase(),
        title: organization,
        isLeaf: true,
      }))
      .slice(0, 10),
  };
  accessCost: accessCost | 'any' = 'any';
  accessCosts: NzTreeNodeOptions[] = [
    {
      key: 'yes',
      title: 'Yes',
    },
    {
      key: 'no',
      title: 'No',
    },
    {
      key: 'maybe',
      title: 'Maybe',
    },
    {
      key: 'any',
      title: 'Any',
    },
  ];
  expertiseLevel: expertiseLevel | 'any' = 'any';
  expertiseLevels: NzTreeNodeOptions[] = [
    {
      key: 'beginner',
      title: 'Beginner',
    },
    {
      key: 'intermediate',
      title: 'Intermediate',
    },
    {
      key: 'advanced',
      title: 'Advanced',
    },
    {
      key: 'any',
      title: 'Any',
    },
  ];
}
