import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'lib-counter-button',
  templateUrl: './counter-button.component.html',
  styleUrls: ['./counter-button.component.css']
})
export class CounterButtonComponent implements OnInit {
  @Output() countChanged: EventEmitter<number> = new EventEmitter();
  clickCount = 0;

  constructor() {}

  ngOnInit() {}

  handleButtonClick() {
    this.clickCount++;
    this.countChanged.emit(this.clickCount);
  }
}