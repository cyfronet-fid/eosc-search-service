// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
//
// const routes: Routes = [
//   { path: '', pathMatch: 'full', redirectTo: 'marketplace' },
//   { path: '**', pathMatch: 'full', redirectTo: '' }, // TODO: Create Error page
// ];
//
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './pages';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: LandingPageComponent },
      { path: '**', pathMatch: 'full', redirectTo: '' }, // TODO: Create Error page
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
