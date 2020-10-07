import { Component, OnInit, Input } from '@angular/core';
import {  SchemaManager } from '../../base/schemaManager';
import { ComponentType, IComponent } from '../../base/types';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-container',
  templateUrl: './mt-container.component.html',
  styleUrls: ['./mt-container.component.scss']
})
export class MtContainerComponent extends MtBaseComponent implements OnInit {
  usesGrid: boolean = false;

  ngOnInit(): void {
    this.usesGrid = this.sm.usesGrid(this.comp);
  }

  getHighlight(child: IComponent): string {
    return this.sm.getDiffHighlight(child) ? ' highlight' : '';
    // if (!this.sm.DiffValues || !child.field || child.type === ComponentType.datatable) return '';
    // let val1, val2
    // if (child.parentComp &&  child.parentComp.type === ComponentType.datatable) {
    //   const ind = child.parentComp.curRowInd;
    //   if (this.sm.checkValueType(ind) !== IValueType.number) return '';
    //   val1 = this.sm.getValue(child);
    //   val2 = this.sm.getValue(child, this.sm.DiffValues, ind);
    // } else {
    //   val1 = this.sm.getValue(child);
    //   val2 = this.sm.getValue(child, this.sm.DiffValues);
    // }
    // if (val1 !== val2) return ' highlight';
    // return '';
  }


}
