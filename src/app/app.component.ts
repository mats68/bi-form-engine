import { Component } from '@angular/core';
import {schema_IA, values_IA } from './schema/schema_IA';
import {schema1, values1 } from './schema/schema1';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  schema =  schema1;
  values = values1;

  getValues() {
    return JSON.stringify(this.values, null, 2);

  }  


}