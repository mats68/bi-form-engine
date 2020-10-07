import { Component } from '@angular/core';
import {schema_IA, values_IA } from './schema/schema_IA';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  schema =  schema_IA;
  values = values_IA;


}