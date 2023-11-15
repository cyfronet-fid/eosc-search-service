import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { search } from '@components/filters/filter-multiselect/utils';
import {
  IFilterNode,
  IUIFilterTreeNode,
} from '@collections/repositories/types';
import { flatNodesToTree } from '@components/filters/utils';

const CHUNK_SIZE = 100;
const LOAD_NEXT_CHUNK_PERCENTAGE = 90;

@Component({
  selector: 'ess-show-all',
  template: `
    <div class="filter__viewport" (scroll)="onScroll($event)" #content>
      <ess-checkboxes-tree
        [data]="(entities$ | async) ?? []"
        (checkboxesChange)="toggleActive.emit($event)"
      ></ess-checkboxes-tree>
    </div>
  `,
  styles: [
    `
      .filter__viewport {
        max-height: 290px;
        overflow: auto;
      }
    `,
  ],
})
export class ShowAllComponent implements OnChanges {
  private _allEntities: IFilterNode[] = [];
  entities$ = new BehaviorSubject<IUIFilterTreeNode[]>([]);

  @ViewChild('content', { static: false }) content?: unknown;

  @Input()
  query: string | null = null;

  @Input()
  allEntities: IFilterNode[] = [];

  @Output()
  toggleActive = new EventEmitter<[IUIFilterTreeNode, boolean][]>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query'] || changes['nonActiveEntities']) {
      this._allEntities = search(this.query, this.allEntities);

      this.entities$.next(
        flatNodesToTree(this._allEntities).slice(0, CHUNK_SIZE)
      );
    }
  }

  onScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const scrollPercentage = this._calculateScrollPercentage(target);

    if (scrollPercentage >= LOAD_NEXT_CHUNK_PERCENTAGE) {
      this.loadNextNonActiveChunk();
    }
  };

  loadNextNonActiveChunk = () => {
    const chunk = this.entities$.value;
    const offset = chunk.length;
    const nextChunkAvailable = offset !== this._allEntities.length;
    if (!nextChunkAvailable) {
      return;
    }

    this.entities$.next([
      ...chunk,
      ...flatNodesToTree(this._allEntities).slice(offset, offset + CHUNK_SIZE),
    ]);
  };

  _calculateScrollPercentage(target: HTMLElement): number {
    const totalHeight = target.scrollHeight;
    const viewportHeight = target.clientHeight;
    const totalScrollableHeight = totalHeight - viewportHeight;
    const currentPosition = target.scrollTop;

    return (currentPosition / totalScrollableHeight) * 100;
  }
}
