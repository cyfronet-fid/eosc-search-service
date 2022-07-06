import { ICategory } from '../../types';

export const getFirstChild = (entity: ICategory, entities: ICategory[]) => entities
  .find(({ parentId }) => parentId === entity.id)
export const countChildren = (entity: ICategory, entities: ICategory[]) => entities
  .filter(({ parentId }) => parentId === entity.id)?.length || 0;
export function* treeOf(entity: ICategory, entities: { [id: string]: ICategory }) {
  yield entity;
  let parent = entity;
  while (parent?.parentId) {
    parent = entities[entity.parentId as string];
    yield parent;
  }
}
