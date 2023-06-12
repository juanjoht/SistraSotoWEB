import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderListComponent } from './order-list.component';

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: OrderListComponent }
	])],
	exports: [RouterModule]
})
export class OrderRoutingModule { }
