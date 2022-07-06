import {Injectable} from "@angular/core";
import {createStore, setProps} from "@ngneat/elf";
import {
  selectActiveId,
  setEntities,
  withActiveId,
  withEntities
} from "@ngneat/elf-entities";
import { ICategory } from '../../types';
import {map, shareReplay, tap} from "rxjs";
import {countChildren, getFirstChild, treeOf} from "./utils";

@Injectable({ providedIn: 'root' })
export class CategoriesRepository {
  readonly _store$ = createStore(
    {
      name: `categories`,
    },
    withEntities<ICategory>(),
    withActiveId(undefined)
  );

  readonly currentCategories$ = this._store$.pipe(
    map(({
           activeId,
           entities
    }) => {
      activeId = activeId && entities[activeId].isLeaf ? entities[activeId].parentId : activeId;
      return Object.values(entities).filter(({ parentId }) => parentId === activeId)
    })
  );
  readonly activeId$ =  this._store$.pipe(selectActiveId());
  readonly tree$ = this._store$.pipe(
    map(({ entities, activeId }) => activeId === undefined
      ? []
      : [...treeOf(entities[activeId], entities)].reverse()
    ),
    shareReplay(1)
  );
  get active() {
    const activeId = this._store$.value.activeId;
    return activeId ? this._store$.value.entities[activeId] : undefined;
  }
  setActive = (newId: string | undefined = undefined) => this._store$.update(setProps((state) => {
    if (newId === undefined) {
      return { ...state, activeId: undefined };
    }

    const { entities } = state;
    const hasOneChild = countChildren(entities[newId], Object.values(entities)) === 1;
    if (hasOneChild) {
      const firstChild = getFirstChild(entities[newId], Object.values(entities)) as ICategory;
      newId = firstChild.id;
    }

    return { ...state, activeId: newId };
  }));
  setCategories = (categories: ICategory[]) => this._store$.update(setEntities(categories));
}
