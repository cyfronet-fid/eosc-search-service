import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingPageModule } from './pages/landing-page/landing-page.module';
import { ErrorPageModule } from './pages/error-page/error-page.module';
import { SearchPageModule } from './pages/search-page/search-page.module';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', loadChildren: () => LandingPageModule },
      { path: 'search', loadChildren: () => SearchPageModule },
      { path: '**', pathMatch: 'full', redirectTo: 'error/404' },
      { path: 'error', loadChildren: () => ErrorPageModule },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
