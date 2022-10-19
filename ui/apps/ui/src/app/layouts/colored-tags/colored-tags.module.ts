import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColoredTagsComponent } from './colored-tags.component';
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [ColoredTagsComponent],
  imports: [CommonModule, RouterModule],
    exports: [
        ColoredTagsComponent
    ]
})
export class ColoredTagsModule {}
