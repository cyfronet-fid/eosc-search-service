import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'ess-project-result',
  templateUrl: './project-result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ProjectResultComponent implements OnInit {
  @Input() id!: string;
  //   @Input() partners: string[] = []; // TODO
  @Input() fundedUnder = '';
  @Input() currency = '';
  @Input() cost = 0;
  formatedCost = '';
  @Input() startDate = '';
  @Input() endDate = '';

  status = '';

  setStatus(start: string, end: string) {
    const newStart = moment(start);
    const newEnd = moment(end);
    const now = moment();
    if (newEnd.isValid() && newStart.isValid() && newEnd > newStart) {
      if (newEnd < now && newStart < now) {
        this.status = 'Closed';
      } else if (newStart < now && newEnd > now) {
        this.status = 'Ongoing';
      } else if (newEnd > now && newStart > now) {
        this.status = 'Scheduled';
      }
    }
  }

  ngOnInit(): void {
    this.setStatus(this.startDate, this.endDate);

    if (this.cost && this.currency) {
      this.formatedCost = new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: this.currency,
      }).format(this.cost);
    }
  }
}
