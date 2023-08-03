import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderListApproveComponent } from './order-list-approve.component';

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: OrderListApproveComponent }
	])],
	exports: [RouterModule]
})
export class OrderApproveRoutingModule { }
