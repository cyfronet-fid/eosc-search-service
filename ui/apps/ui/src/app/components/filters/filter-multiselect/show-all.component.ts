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
const RECORD_HEIGHT = 29; // PX
const LOAD_NEXT_CHUNK_INDEX = CHUNK_SIZE * 0.9;

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
  private _latestChunk = 0;
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
      this._latestChunk = 0;
    }
  }

  onScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const currentPosition = target.scrollTop;
    const currentIndex = Math.ceil(currentPosition / RECORD_HEIGHT);
    const currentChunk = Math.floor(currentIndex / LOAD_NEXT_CHUNK_INDEX);
    if (currentChunk > this._latestChunk) {
      this._latestChunk = currentChunk;
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
}
