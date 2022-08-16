import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsWithPaginationComponent } from './results-with-pagination.component';
import { PaginationComponent } from './pagination.component';
import { ResultComponent } from './result.component';
import {RouterModule} from "@angular/router";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";

@NgModule({
  declarations: [
    ResultsWithPaginationComponent,
    PaginationComponent,
    ResultComponent,
  ],
  imports: [CommonModule, RouterModule, NzEmptyModule, NzSkeletonModule],
  exports: [ResultsWithPaginationComponent],
})
export class ResultsWithPaginationModule {}
