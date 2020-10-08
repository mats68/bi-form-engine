import { Component, OnInit, Input } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-html',
  templateUrl: './mt-html.component.html',
  styleUrls: ['./mt-html.component.scss']
})
export class MtHtmlComponent extends MtBaseComponent implements OnInit {
  ngOnInit(): void {
  }

}
