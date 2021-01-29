import { Component } from '@angular/core';
import {schema_IA, values_IA } from './schema/schema_IA';
import {schema1, values1 } from './schema/schema1';
import { SchemaManager } from 'dist/bi-formular-engine/public-api';
subscriptionFocus: Subscription;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  schema =  schema1;
  values = values1;
  sm: SchemaManager = new SchemaManager();
  ShowValues = false

  getValues() {
    return JSON.stringify(this.values, null, 2);

  }  

  showValues() {
    this.ShowValues = !this.ShowValues
  }

  this.subscriptionChange =  this.sm.onChange.subscribe({
    next: (comp) => {

    }
  });



}