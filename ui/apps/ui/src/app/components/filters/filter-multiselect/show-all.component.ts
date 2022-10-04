import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FilterTreeNode } from '@components/filters/types';
import { BehaviorSubject } from 'rxjs';

const CHUNK_SIZE = 10;
const RECORD_HEIGHT = 29; // PX
const LOAD_NEXT_CHUNK_INDEX = CHUNK_SIZE * 0.5;

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
        [data]="(chunkedNonActiveEntities$ | async) ?? []"
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
export class ShowAllComponent {
  private _latestChunk = 0;
  private _nonActiveEntities: FilterTreeNode[] = [];
  chunkedNonActiveEntities$ = new BehaviorSubject<FilterTreeNode[]>([]);

  @ViewChild('content', { static: false }) content?: unknown;

  @Input()
  activeEntities: FilterTreeNode[] = [];

  @Input()
  set nonActiveEntities(nonActiveEntities: FilterTreeNode[]) {
    this._nonActiveEntities = nonActiveEntities;
    this.chunkedNonActiveEntities$.next(
      this._nonActiveEntities.slice(0, CHUNK_SIZE)
    );
    this._latestChunk = 0;
  }

  @Output()
  toggleActive = new EventEmitter<[FilterTreeNode, boolean]>();

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
    const nextChunkAvailable = offset !== this._nonActiveEntities.length;
    if (!nextChunkAvailable) {
      return;
    }

    this.chunkedNonActiveEntities$.next([
      ...chunk,
      ...this._nonActiveEntities.slice(offset, offset + CHUNK_SIZE),
    ]);
  };
}
