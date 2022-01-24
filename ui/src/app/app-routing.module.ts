import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";

const routes: Routes = [
  { path: "", pathMatch: "full", component: MainPageComponent },
  // { path: 'auth/:action', component: AuthComponent },
  // { path: "**", pathMatch: "full", component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
