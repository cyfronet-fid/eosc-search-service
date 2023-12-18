/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';

@Component({
  selector: 'ess-adv-search-guide',
  templateUrl: './adv-search-guide.component.html',
  styleUrls: ['./adv-search-guide.component.scss'],
})
export class AdvSearchGuideComponent {
  public numberExpanded = 0;

  onShow() {
    this.numberExpanded += 1;
  }

  onHide() {
    this.numberExpanded -= 1;
  }
}
