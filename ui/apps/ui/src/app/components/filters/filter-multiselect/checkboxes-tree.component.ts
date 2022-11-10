import {
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { FilterTreeNode } from '../types';

@Component({
  selector: 'ess-checkboxes-tree',
  template: `
    <nz-tree-view
      [nzTreeControl]="$any(treeControl)"
      [nzDataSource]="dataSource"
      [trackBy]="trackByName"
    >
      <nz-tree-node *nzTreeNodeDef="let node" nzTreeNodePadding="">
        <nz-tree-node-toggle nzTreeNodeNoopToggle></nz-tree-node-toggle>
        <nz-tree-node-checkbox
          [nzDisabled]="node.disabled"
          [nzChecked]="checklistSelection.isSelected(node)"
          (nzClick)="leafItemSelectionToggle(node)"
        ></nz-tree-node-checkbox>
        <nz-tree-node-option
          [nzDisabled]="node.disabled"
          (nzClick)="leafItemSelectionToggle(node)"
        >
          <span [class.text-secondary]="+node.count === 0">{{
            node.name
          }}</span>
          <span class="filter-count">&nbsp;({{ node.count }})</span>
        </nz-tree-node-option>
      </nz-tree-node>

      <nz-tree-node
        *nzTreeNodeDef="let node; when: hasChild"
        nzTreeNodePadding=""
      >
        <nz-tree-node-toggle>
          <i nz-icon nzType="caret-down" nzTreeNodeToggleRotateIcon></i>
        </nz-tree-node-toggle>
        <nz-tree-node-checkbox
          [nzDisabled]="node.disabled"
          [nzChecked]="descendantsAllSelected(node)"
          [nzIndeterminate]="descendantsPartiallySelected(node)"
          (nzClick)="itemSelectionToggle(node)"
        ></nz-tree-node-checkbox>
        <nz-tree-node-option
          [nzDisabled]="node.disabled"
          (nzClick)="itemSelectionToggle(node)"
        >
          <span [class.text-secondary]="+node.count === 0">{{
            node.name
          }}</span>
          <span class="text-secondary">&nbsp;({{ node.count }})</span>
        </nz-tree-node-option>
      </nz-tree-node>
    </nz-tree-view>
  `,
  styles: [
    `
      .filter-count {
        color: rgba(0, 0, 0, 0.45);
      }
      .ant-tree .ant-tree-node-content-wrapper {
        line-height: 18px !important;
      }
      .ant-tree-checkbox {
        margin: 1px 2px 0 0 !important;
      }

      .ant-tree .ant-tree-treenode {
        padding: 0 !important;
      }
      ::ng-deep .ant-tree-node-content-wrapper .ant-tree-title {
        word-wrap: break-word;
        display: block;
        max-width: 180px;
      }
    `,
  ],
})
export class CheckboxesTreeComponent {
  @Input()
  set data(data: FilterTreeNode[]) {
    this.dataSource.setData(data);
  }

  @Output()
  checkboxesChange = new EventEmitter<[FilterTreeNode, boolean]>();

  flatNodeMap = new Map<FilterTreeNode, FilterTreeNode>();
  nestedNodeMap = new Map<FilterTreeNode, FilterTreeNode>();
  checklistSelection = new SelectionModel<FilterTreeNode>(true);

  treeControl = new FlatTreeControl<FilterTreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  readonly trackByName: TrackByFunction<FilterTreeNode> = (
    index: number,
    item: FilterTreeNode
  ) => `${item.filter}-${item.id}-${item.count}`;

  private transformer = (
    node: FilterTreeNode,
    level: number
  ): FilterTreeNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
            expandable: !!node.children && node.children.length > 0,
            id: node.id,
            name: node.name,
            filter: node.filter,
            value: node.value,
            level,
            count: node.count,
            disabled: !!node.disabled,
            isSelected: node.isSelected,
          };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    if (node.isSelected) {
      this.leafItemSelectionToggle(flatNode);
    }
    return flatNode;
  };
  // eslint-disable-next-line @typescript-eslint/member-ordering
  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FilterTreeNode): boolean => node.expandable;

  descendantsAllSelected(node: FilterTreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return (
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child))
    );
  }

  descendantsPartiallySelected(node: FilterTreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FilterTreeNode): void {
    this.checklistSelection.toggle(node);
    this.checkboxesChange.emit([
      node,
      this.checklistSelection.isSelected(node),
    ]);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FilterTreeNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FilterTreeNode): void {
    let parent: FilterTreeNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FilterTreeNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FilterTreeNode): FilterTreeNode | null {
    const currentLevel = node.level;

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
