import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IgServicesCardComponent } from './ig-services-card.component';
import { IgServicesDetailCardComponent } from './ig-services-detail-card.component';

@NgModule({
  declarations: [IgServicesCardComponent, IgServicesDetailCardComponent],
  imports: [CommonModule],
  exports: [IgServicesCardComponent, IgServicesDetailCardComponent],
})
export class IgServicesCardModule {}
