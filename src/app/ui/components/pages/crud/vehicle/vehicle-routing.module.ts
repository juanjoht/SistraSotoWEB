import { RouterModule } from '@angular/router';
import { VehicleListComponent } from './vehicle-list.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: VehicleListComponent }
	])],
	exports: [RouterModule]
})
export class VehicleRoutingModule { }