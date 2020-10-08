import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ISchema } from '../../base/types';
import { SchemaManager, ISettings } from '../../base/schemaManager';

@Component({
  selector: 'bi-form',
  templateUrl: './vs-form.component.html',
  styleUrls: ['./vs-form.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }})
export class VsFormComponent implements OnInit, OnChanges {
  @Input() schema: ISchema;
  @Input() values: any;
  @Input() settings: ISettings;
  schemaManger: SchemaManager;

  constructor() { 

  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (!this.schemaManger) {
      this.schemaManger = new SchemaManager(this.settings);
    }
    if (!this.schema.name) {
      this.schema.name = Math.random().toString(36).substr(2, 5);
    }

    if (!this.schemaManger.Schema || this.schema.name !== this.schemaManger.Schema.name) {
      this.schemaManger.InitSchema(this.schema);
      if (this.values) this.schemaManger.InitValues(this.values);
    } else if (this.values !== this.schemaManger.Values) {
      this.schemaManger.InitValues(this.values);
    }
 
  }

  onResize(event){
    this.schemaManger.InitScreenSize();
  }


}
