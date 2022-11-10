import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FilterTreeNode } from '@components/filters/types';
import { BehaviorSubject } from 'rxjs';
import { search } from '@components/filters/filter-multiselect/utils';

const CHUNK_SIZE = 100;
const RECORD_HEIGHT = 29; // PX
const LOAD_NEXT_CHUNK_INDEX = CHUNK_SIZE * 0.9;

@Component({
  selector: 'ess-show-all',
  template: `
    <div class="filter__viewport">
      <ess-checkboxes-tree
        [data]="activeEntities"
        (checkboxesChange)="
          $event[1] === false ? toggleActive.emit($event) : null
        "
      ></ess-checkboxes-tree>
    </div>

    <div class="filter__viewport" (scroll)="onScroll($event)" #content>
      <ess-checkboxes-tree
        [data]="search(query, (chunkedNonActiveEntities$ | async) ?? [])"
        (checkboxesChange)="
          $event[1] === true ? toggleActive.emit($event) : null
        "
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
  private _availableNonActiveEntities: FilterTreeNode[] = [];
  chunkedNonActiveEntities$ = new BehaviorSubject<FilterTreeNode[]>([]);

  @ViewChild('content', { static: false }) content?: unknown;

  @Input()
  query: string | null = null;

  @Input()
  activeEntities: FilterTreeNode[] = [];

  @Input()
  nonActiveEntities: FilterTreeNode[] = [];

  @Output()
  toggleActive = new EventEmitter<[FilterTreeNode, boolean]>();

  search = search;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query'] || changes['nonActiveEntities']) {
      this._availableNonActiveEntities = search(
        this.query,
        this.nonActiveEntities
      );
      this.chunkedNonActiveEntities$.next(
        this._availableNonActiveEntities.slice(0, CHUNK_SIZE)
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
    const chunk = this.chunkedNonActiveEntities$.value;
    const offset = chunk.length;
    const nextChunkAvailable =
      offset !== this._availableNonActiveEntities.length;
    if (!nextChunkAvailable) {
      return;
    }

    this.chunkedNonActiveEntities$.next([
      ...chunk,
      ...this._availableNonActiveEntities.slice(offset, offset + CHUNK_SIZE),
    ]);
  };
}
