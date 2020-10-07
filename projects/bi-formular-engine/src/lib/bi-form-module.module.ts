import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';

import { MtInputComponent } from './components/mt-input/mt-input.component';
import { MtCheckboxComponent } from './components/mt-checkbox/mt-checkbox.component';
import { MtItemComponent } from './base/mt-item/mt-item.component';
import { MtFormComponent } from './components/mt-form/mt-form.component';
import { MtExpComponent } from './components/mt-exp/mt-exp.component';
import { MtBtnComponent } from './components/mt-btn/mt-btn.component';
import { MtDividerComponent } from './components/mt-divider/mt-divider.component';
import { MtContainerComponent } from './base/mt-container/mt-container.component';
import { VsFormComponent } from './base/vs-form/vs-form.component';
import { MtToolbarComponent } from './components/mt-toolbar/mt-toolbar.component';
import { MtDatatableComponent } from './components/mt-datatable/mt-datatable.component';
import { MtErrorpanelComponent } from './components/mt-errorpanel/mt-errorpanel.component';
import { MtTabsComponent } from './components/mt-tabs/mt-tabs.component';
import { MtRadioComponent } from './components/mt-radio/mt-radio.component';
import { MtLblComponent } from './components/mt-lbl/mt-lbl.component';
import { MtPanelComponent } from './components/mt-panel/mt-panel.component';
import { MtCardComponent } from './components/mt-card/mt-card.component';
import { VsDiffComponent } from './base/vs-diff/vs-diff.component';
import { MtHtmlComponent } from './components/mt-html/mt-html.component';
import { MtBaseComponent } from './base/mt-base/mt-base.component';
import { MtLinkComponent } from './components/mt-link/mt-link.component';
import { MtSwitchComponent } from './components/mt-switch/mt-switch.component';
import { MtSwitchpanelComponent } from './components/mt-switchpanel/mt-switchpanel.component';
import { MtDateComponent } from './components/mt-date/mt-date.component';
import { MtIconComponent } from './components/mt-icon/mt-icon.component';
import { MtSliderComponent } from './components/mt-slider/mt-slider.component';
import { MtSidenavComponent } from './components/mt-sidenav/mt-sidenav.component';
// import { ComponentType, IComponent, ISchema } from './base/types';


import { NgxMaskModule, IConfig } from 'ngx-mask';



// const maskConfig: Partial<IConfig> = {
//   dropSpecialCharacters: false,
//   validation: false,
//   thousandSeparator: "'",
// };

// const ngxMaskModule = NgxMaskModule.forRoot(maskConfig);



import { CounterButtonComponent } from './counter-button/counter-button.component';



@NgModule({
  declarations: [
    CounterButtonComponent,
    MtInputComponent,
    MtCheckboxComponent,
    MtItemComponent,
    MtFormComponent,
    MtExpComponent,
    MtBtnComponent,
    MtDividerComponent,
    MtContainerComponent,
    VsFormComponent,
    MtToolbarComponent,
    MtDatatableComponent,
    MtErrorpanelComponent,
    MtTabsComponent,
    MtRadioComponent,
    MtLblComponent,
    MtPanelComponent,
    MtCardComponent,
    VsDiffComponent,
    MtHtmlComponent,
    MtBaseComponent,
    MtLinkComponent,
    MtSwitchComponent,
    MtSwitchpanelComponent,
    MtDateComponent,
    MtIconComponent,
    MtSliderComponent,
    MtSidenavComponent,
    VsFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatExpansionModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    OverlayModule,
    NgxMaskModule,
  ],
  exports: [
    CounterButtonComponent,
    VsFormComponent,
    // ComponentType,
    // ComponentType, 
    // IComponent, ISchema

  ]
})
export class BiFormModuleModule { }
