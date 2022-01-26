import { Component } from '@angular/core';
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzTreeNodeOptions} from "ng-zorro-antd/tree";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  recommendedResources = [
    {
      imageSrc: "https://picsum.photos/150/150",
      label: "Test",
      rating: 3,
      description: "Lorem ipsum",
      organisation: "New organisation"
    },
    {
      imageSrc: "https://picsum.photos/150/150",
      label: "Test",
      rating: 3,
      description: "Lorem ipsum",
      organisation: "New organisation"
    },
    {
      imageSrc: "https://picsum.photos/150/150",
      label: "Test",
      rating: 3,
      description: "Lorem ipsum",
      organisation: "New organisation"
    }
  ]
  categories = [
    {
      label: "Access physical & eifrastructures",
      count: 3,
    },
    {
      label: "Aggregators & Integrators",
      count: 12
    },
    {
      label: "Other",
      count: 36
    }
  ]
  nodes: NzTreeNodeOptions[] = [
    {
      title: "Generic",
      key: "generic",
      isLeaf: true,
    },
    {
      title: 'Natural Sciences',
      key: 'natural-sciences',
      expanded: true,
      children: [
        {
          title: 'Earth & Related Environmental Sciences',
          key: 'earth-and-related-environmental-sciences',
          isLeaf: true
        },
        {
          title: 'Biological Sciences',
          key: 'biological-sciences',
          isLeaf: true
        },
        {
          title: 'Chemical sciences',
          key: 'chemical-sciences',
          isLeaf: true
        }
      ]
    },
  ];

  constructor() { }
}
