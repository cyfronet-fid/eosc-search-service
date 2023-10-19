import { Component } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ess-adv-search-guide',
  templateUrl: './adv-search-guide.component.html',
  styleUrls: ['./adv-search-guide.component.scss'],
})
export class AdvSearchGuideComponent {
  public isCollapsed = true;

  collapseAllTabs(acc: any) {
    this.isCollapsed = true;
    acc.collapseAll();
  }
  expandCollapsed(acc: any) {
    this.isCollapsed = false;
    acc.expandAll();
  }
  toggleState($event: NgbPanelChangeEvent) {
    this.isCollapsed == $event.nextState;
  }
}
