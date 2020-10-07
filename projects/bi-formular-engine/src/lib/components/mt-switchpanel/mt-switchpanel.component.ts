import { Component, OnInit, OnDestroy,  } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-switchpanel',
  templateUrl: './mt-switchpanel.component.html',
  styleUrls: ['./mt-switchpanel.component.scss']
})
export class MtSwitchpanelComponent extends MtBaseComponent implements OnInit {
  opened: boolean;

  ngOnInit(): void {
    this.registerFocus();
  }

  ngOnDestroy() {
    this.unregisterFocus();
  }

  get valueSwitch(): boolean {
    if (this.comp.field) {
      return this.sm.getValue(this.comp);
    } else {
      return this.opened;
    }
  }

  set valueSwitch(val: boolean) {
    if (this.comp.field) {
      this.sm.updateValue(this.comp, val);
    } 
    this.opened = val;
  }

  toggle() {
    this.valueSwitch = !this.valueSwitch;
  }

  getIcon(): string {
    return !this.valueSwitch ? 'add' : 'remove';
  }
  getIconColor(): string {
    return !this.valueSwitch ? 'primary' : '';
  }



}
