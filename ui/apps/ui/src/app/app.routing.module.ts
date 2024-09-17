import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
  },
  {
    path: `${SEARCH_PAGE_PATH}/all`,
    pathMatch: 'full',
    redirectTo: `${SEARCH_PAGE_PATH}/all_collection`,
  },
  {
    path: SEARCH_PAGE_PATH,
    loadChildren: () =>
      import('./pages/search-page/search-page.module').then(
        (m) => m.SearchPageModule
      ),
  },
  {
    path: 'trainings',
    loadChildren: () =>
      import('./pages/trainings-page/trainings-page.module').then(
        (m) => m.TrainingsPageModule
      ),
  },
  {
    path: 'guidelines',
    loadChildren: () =>
      import('./pages/guidelines-page/guidelines-page.module').then(
        (m) => m.GuidelinesPageModule
      ),
  },
  {
    path: 'acceptable-use-policy',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/acceptable-use-policy/acceptable-use-policy.module').then(
        (m) => m.AcceptableUsePolicyModule
      ),
  },
  {
    path: 'asguide',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/adv-search-guide/adv-search-guide.module').then(
        (m) => m.AdvSearchGuideModule
      ),
  },
  {
    path: 'privacy-policy',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'error/404',
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./pages/error-page/error-page.module').then(
        (m) => m.ErrorPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
