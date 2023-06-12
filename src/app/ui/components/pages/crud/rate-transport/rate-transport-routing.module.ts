import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RateTransportListComponent } from './rate-transport-list.component';

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: RateTransportListComponent }
	])],
	exports: [RouterModule]
})
export class RateTransportRoutingModule { }
