import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectbusPageComponent } from './selectbus-page.component';

const routes: Routes = [
  {
    path: '',
    component: SelectbusPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectbusRoutingModule { }
