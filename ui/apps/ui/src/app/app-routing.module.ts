import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';
import { environment } from '../environments/environment';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LandingPageComponent },
  ...environment.search.sets.map((set) => ({
    path: set.urlPath,
    component: SearchPageComponent,
  })),
  { path: '**', pathMatch: 'full', redirectTo: '' }, // TODO: Create Error page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
