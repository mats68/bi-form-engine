import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IValueType, SchemaManager } from '../../base/schemaManager';
import { IComponent, ISummaryFunction } from '../../base/types';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';


@Component({
  selector: 'mt-datatable',
  templateUrl: './mt-datatable.component.html',
  styleUrls: ['./mt-datatable.component.scss']
})
export class MtDatatableComponent extends MtBaseComponent implements OnInit, OnChanges {
  @Input() curRowInd: number;
  @Input() data: any;
  currow: any;

  fields: IComponent[];
  toolbar: IComponent;

  ngOnInit(): void {
    this.fields = [];

    if (this.comp.columns) {
      this.comp.columns.forEach(s => {
        const c = this.sm.getCompByField(s);
        if (c) this.fields.push(c);
      });
    } else {
      this.sm.traverseSchema(c => {
        if (c.field && c.type !== 'datatable') this.fields.push(c);
      }, null, this.comp);
    }

    this.toolbar = {
      type: 'toolbar',
      label: this.comp.label,
      color: this.comp.toolbarColor,
      children: [
        {
          type: 'button',
          kind: 'minifab',
          tooltip: this.sm.Strings.ds_ins,
          icon: 'add',
          color: 'primary',
          onClick: () => { this.Insert() }
        },
        {
          type: 'button',
          kind: 'minifab',
          tooltip: this.sm.Strings.ds_copy,
          icon: 'content_copy',
          color: 'primary',
          disabled: () => { return this.hasCurRow() },
          onClick: () => { this.CopyRow() }
        },
        {
          type: 'button',
          kind: 'minifab',
          tooltip: this.sm.Strings.ds_del,
          icon: 'delete',
          color: 'primary',
          disabled: () => { return this.hasCurRow() },
          onClick: () => { this.DeleteRow() }
        },
      ]

    }
  }

  ngOnChanges() {
    const typ = this.sm.checkValueType(this.curRowInd);
    if (typ === IValueType.number && this.data.length > this.curRowInd) {
      this.InitCurRow(this.curRowInd);
    }
  }

  Insert(): void {
    const row = {};
    const len = this.data.push(row);
    this.sm.updateValue(this.comp, this.data);
    this.sm.InitValuesArray(this.comp, this.data[len - 1]);
    this.InitCurRow(len - 1);
  }

  CopyRow(): void {
    if (!this.currow) return;
    const newrow = JSON.parse(JSON.stringify(this.currow));
    const len = this.data.push(newrow);
    this.sm.updateValue(this.comp, this.data);
    this.InitCurRow(len - 1);
  }

  DeleteRow(): void {
    if (!this.currow) return;
    this.data = this.data.filter(r => r !== this.currow);
    this.sm.updateValue(this.comp, this.data);
    this.sm.removeAllErrors();
    if (this.sm.AllValidated) {
      this.sm.validateAll();
    }
    this.InitCurRow(-1);

  }

  toggleExpand(row: any) {
    let ind = this.data.findIndex(r => r === row);
    if (this.comp.curRowInd === ind) ind = -1;
    this.InitCurRow(ind);
  }


  InitCurRow(rowInd: number) {
    if (rowInd === -1) {
      this.currow = null;
      this.comp.curRowInd = -1;
    } else {
      if (this.comp.curRowInd !== rowInd) this.comp.curRowInd = rowInd;
      this.currow = this.data[rowInd];
    }
  }

  summaryCard(row: any): any {
    if (!this.comp.summaryCard) return 'no summaryCard function!';
    return this.comp.summaryCard(this.sm, this.comp, row);
  }

  summaryTitle(field: IComponent): any {
    let ret;
    if (field.summaryCellTitle) {
      ret = field.summaryCellTitle(this.sm, field);
    } else if (this.comp.summaryCellTitle) {
      ret = this.comp.summaryCellTitle(this.sm, field);
    }
    if (this.sm.checkValueType(ret) === IValueType.undefined) {
      ret = this.sm.getLabel(field);
    }
    return ret;
  }

  summaryCell(field: IComponent, arrayInd: number): any {
    let ret;
    const val = this.sm.getValue(field, null, arrayInd);
    if (field.summaryCellValue) {
      ret = field.summaryCellValue(this.sm, field, val, arrayInd);      
    } else if (this.comp.summaryCellValue) {
      ret = this.comp.summaryCellValue(this.sm, field, val, arrayInd);
    }
    if (this.sm.checkValueType(ret) === IValueType.undefined) {
      ret = this.sm.getValue(field, this.sm.Values, arrayInd);
    }
    return ret;
  }

  hasCurRow(): boolean {
    return !this.currow;
  }

  hasData(): boolean {
    let has = false;
    const typ = this.sm.checkValueType(this.data);
    if (typ === IValueType.array && this.data.length > 0) {
      has = true;
    }
    return has;
  }


  getCellStyle(ind: number) {
    if (ind < this.data.length - 1) {
      return 'border-bottom-style: solid;border-bottom-width: thin;border-spacing: 0;';
    } else {
      return '';
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.comp.dragdrop) {
      moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    }
  }

}
