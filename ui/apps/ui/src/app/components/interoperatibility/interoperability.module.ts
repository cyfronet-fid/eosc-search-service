import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InteroperabilityNavigationBarComponent } from '@components/interoperatibility/interoperability-navigation-bar.component';

@NgModule({
  declarations: [InteroperabilityNavigationBarComponent],
  imports: [CommonModule, RouterModule],
  exports: [InteroperabilityNavigationBarComponent],
})
export class InteroperabilityModule {}
