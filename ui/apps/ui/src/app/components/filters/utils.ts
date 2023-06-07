import {
  IFacetBucket,
  IFilterNode,
  IUIFilterTreeNode,
} from '@collections/repositories/types';

export const TREE_SPLIT_CHAR = '>';
export const facetToFlatNodes = (
  buckets: IFacetBucket[],
  facetName: string
): IFilterNode[] =>
  (buckets ?? []).map(({ val, count }) => ({
    id: val + '',
    name: (val + '').split(TREE_SPLIT_CHAR).pop() ?? '',
    value: val + '',
    count: count + '',
    filter: facetName,
    isSelected: false,
    level: (val + '').match(new RegExp(TREE_SPLIT_CHAR, 'g'))?.length ?? 0,
    parent: (val + '').includes(TREE_SPLIT_CHAR)
      ? (val + '').split(TREE_SPLIT_CHAR).slice(0, -1).join(TREE_SPLIT_CHAR)
      : undefined,
  }));

export function* toAllLevels(value: string) {
  const lvls = value.split(TREE_SPLIT_CHAR);
  let currentLvl = lvls.shift();
  yield currentLvl;
  for (const lvl of lvls) {
    currentLvl += '>' + lvl;
    yield currentLvl;
  }
}

export const flatNodesToTree = (
  nodes: IFilterNode[],
  customSort?: (a: IFilterNode, b: IFilterNode) => number
): IUIFilterTreeNode[] => {
  const allLvlsPermutations = facetToFlatNodes(
    [
      ...new Set(
        nodes
          .filter((node) => !!node.value)
          .map((node) => [...toAllLevels(node.value)])
          .reduce((acc, lvls) => [...acc, ...lvls], [])
      ),
    ].map((val) => ({ val: val as string, count: 0 })),
    nodes[0]?.filter
  );
  const allLvlsPermIdMap = allLvlsPermutations
    .map((node) => ({
      [node.id]: { ...node, children: [] } as IUIFilterTreeNode,
    }))
    .reduce((acc, node) => ({ ...acc, ...node }), {});
  const idMap = nodes
    .map((node) => ({
      [node.id]: { ...node, children: [] } as IUIFilterTreeNode,
    }))
    .reduce((acc, node) => ({ ...acc, ...node }), {});
  const fullMap = { ...allLvlsPermIdMap, ...idMap };
  const allNodes = Object.values(fullMap);

  for (const node of allNodes) {
    const parentExists = node.level > 0;
    if (!parentExists) {
      continue;
    }

    fullMap[node.parent as string].children = [
      ...(fullMap[node.parent as string].children as IUIFilterTreeNode[]),
      node,
    ];
  }

  const defaultSort = (a: IFilterNode, b: IFilterNode) => +b.count - +a.count;

  return Object.values(fullMap)
    .filter(({ level }) => level === 0)
    .sort(customSort ?? defaultSort);
};
