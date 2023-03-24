import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteroperabilityGuidelineCardComponent } from '@components/interoperability/interoperability-guideline-card.component';
import { RouterModule } from '@angular/router';
import { InteroperabilityHelperNavigationBarComponent } from '@components/interoperability/interoperability-helper-navigation-bar.component';

@NgModule({
  declarations: [
    InteroperabilityGuidelineCardComponent,
    InteroperabilityHelperNavigationBarComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    InteroperabilityGuidelineCardComponent,
    InteroperabilityHelperNavigationBarComponent,
  ],
})
export class InteroperabilityGuidelineModule {}
