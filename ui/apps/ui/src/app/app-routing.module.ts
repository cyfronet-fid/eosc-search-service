import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'all' },
  { path: 'all', component: SearchPageComponent },
  { path: 'publications', component: SearchPageComponent },
  { path: 'services', component: SearchPageComponent },
  { path: 'trainings', component: SearchPageComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }, // TODO: Create Error page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
