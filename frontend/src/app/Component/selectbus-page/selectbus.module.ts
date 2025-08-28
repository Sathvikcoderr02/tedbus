import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { SelectbusPageComponent } from './selectbus-page.component';
import { HeaderComponent } from './header/header.component';
import { LeftComponent } from './left/left.component';
import { RightComponent } from './right/right.component';
import { SortingBarComponent } from './right/sorting-bar/sorting-bar.component';
import { BusBoxComponent } from './right/bus-box/bus-box.component';
import { BottomTabComponent } from './right/bus-book/bottom-tab/bottom-tab.component';
import { ViewSeatsComponent } from './right/view-seats/view-seats.component';
import { FormDrawerComponent } from './right/form-drawer/form-drawer.component';
import { SmallSeatsComponent } from './right/small-seats/small-seats.component';
import { BusBookingFormComponent } from './right/bus-booking-form/bus-booking-form.component';

// Routing
import { SelectbusRoutingModule } from './selectbus-routing.module';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    SelectbusPageComponent,
    HeaderComponent,
    LeftComponent,
    RightComponent,
    SortingBarComponent,
    BusBoxComponent,
    BottomTabComponent,
    ViewSeatsComponent,
    FormDrawerComponent,
    SmallSeatsComponent,
    BusBookingFormComponent
  ],
  imports: [
    CommonModule,
    
    // Routing
    SelectbusRoutingModule,
    
    // Shared Module (includes all Material modules and common modules)
    SharedModule
  ],
  exports: [
    SelectbusPageComponent,
    HeaderComponent,
    LeftComponent,
    RightComponent,
    SortingBarComponent,
    BusBoxComponent,
    BottomTabComponent,
    ViewSeatsComponent,
    FormDrawerComponent,
    SmallSeatsComponent,
    BusBookingFormComponent
  ]
})
export class SelectbusModule { }
