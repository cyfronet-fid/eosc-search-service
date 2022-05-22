import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './pages';
import { LayoutModule } from '@eosc-search-service/layout';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import {ISet, SearchModule} from '@eosc-search-service/search';
import { FiltersComponent } from './components';
import {ResultComponent} from "./components/result/result.component";
import {SetResolver} from "./services";
import {NzSpinModule} from "ng-zorro-antd/spin";

// const routes: Routes = [
//   ...environment.search.sets.map((set) => ({
//     path: set.urlPath,
//     component: SearchPageComponent,
//   })),
// ];

@NgModule({
  declarations: [SearchPageComponent, FiltersComponent, ResultComponent],
  imports: [
    CommonModule,
    LayoutModule,
    NzEmptyModule,
    ScrollingModule,
    NzListModule,
    NzSkeletonModule,
    NzSpinModule,
    SearchModule,
    RouterModule.forChild([
      {
        resolve: {
          activeSet: SetResolver
        },
        path: 'search/:set',
        component: SearchPageComponent,
      }
    ]),
  ],
  exports: [SearchPageComponent, FiltersComponent, ResultComponent],
})
export class SearchPageModule {
}
