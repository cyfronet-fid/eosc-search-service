import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

export interface TreeNode {
  name: string;
  value: any;
  filter: string;
  count: string;
  disabled?: boolean;
  children?: TreeNode[];
  isSelected: boolean;
}

export interface FlatNode {
  expandable: boolean;
  name: string;
  value: any;
  filter: string;
  count: string;
  level: number;
  disabled: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'ess-checkboxes-tree',
  template: `
    <nz-tree-view [nzTreeControl]="treeControl" [nzDataSource]="dataSource">
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
          {{ node.name }} <span class="filter-count">&nbsp;({{ node.count }})</span>
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
          {{ node.name }} <span class="filter-count">&nbsp;({{ node.count }})</span>
        </nz-tree-node-option>
      </nz-tree-node>
    </nz-tree-view>
  `,
  styles: [`
    .filter-count {
      color: rgba(0, 0, 0, 0.45);
    }
    .ant-tree .ant-tree-node-content-wrapper
    {
      line-height: 18px !important;
    }
    .ant-tree-checkbox {
      margin: 1px 2px 0 0 !important;
    }

    .ant-tree .ant-tree-treenode {
      padding: 0 !important;
    }
    .ant-tree-title {
      word-wrap: break-word;
      display: block;
      max-width: 200px;
    }
  `]
})
export class CheckboxesTreeComponent {
  @Input()
  set data(data: TreeNode[]) {
    this.dataSource.setData(data);
  }

  @Output()
  checkboxesChange = new EventEmitter<[FlatNode, boolean]>();

  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  checklistSelection = new SelectionModel<FlatNode>(true);

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
            expandable: !!node.children && node.children.length > 0,
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

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return (
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child))
    );
  }

  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkboxesChange.emit([
      node,
      this.checklistSelection.isSelected(node),
    ]);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
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

  getParentNode(node: FlatNode): FlatNode | null {
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
