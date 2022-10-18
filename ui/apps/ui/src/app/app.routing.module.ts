import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingPageModule } from '@pages/landing-page/landing-page.module';
import { ErrorPageModule } from '@pages/error-page/error-page.module';
import { SearchPageModule } from '@pages/search-page/search-page.module';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';
import { TrainingsPageModule } from '@pages/trainings-page/trainings-page.module';
import { AcceptableUsePolicyModule } from '@pages/acceptable-use-policy/acceptable-use-policy.module';
import { PrivacyPolicyModule } from '@pages/privacy-policy/privacy-policy.module';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => LandingPageModule,
      },
      {
        path: SEARCH_PAGE_PATH,
        loadChildren: () => SearchPageModule,
      },
      {
        path: 'trainings',
        loadChildren: () => TrainingsPageModule,
      },
      {
        path: 'acceptable-use-policy',
        pathMatch: 'full',
        loadChildren: () => AcceptableUsePolicyModule,
      },
      {
        path: 'privacy-policy',
        pathMatch: 'full',
        loadChildren: () => PrivacyPolicyModule,
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'error/404',
      },
      { path: 'error', loadChildren: () => ErrorPageModule },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
