import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ISchema } from '../../base/types';
import { SchemaManager, ISettings } from '../../base/schemaManager';

@Component({
  selector: 'bi-diff',
  templateUrl: './bi-diff.component.html',
  styleUrls: ['./bi-diff.component.scss']
})
export class BiDiffComponent implements OnInit {
  @Input() schema: ISchema;
  @Input() values1: any;
  @Input() values2: any;
  @Input() settings: ISettings;
  schemaManager1: SchemaManager;
  schemaManager2: SchemaManager;

  constructor() { }

  ngOnInit(): void {
    this.schemaManager1 = new SchemaManager(this.settings);
    this.schemaManager2 = new SchemaManager(this.settings);

    this.schemaManager1.InitSchema(this.schema);
    this.schemaManager2.InitSchema(this.schema);
    this.schemaManager1.InitValues(this.values1, this.values2);
    this.schemaManager2.InitValues(this.values2);
    this.schemaManager2.DisableAll();
    this.schemaManager1.InitDiffHighlight();
  }



}
