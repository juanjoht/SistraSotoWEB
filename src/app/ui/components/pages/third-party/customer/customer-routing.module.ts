import { NgModule } from '@angular/core';
import { CustomerComponent } from './customer.component';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: CustomerComponent }
	])],
	exports: [RouterModule]
})
export class CustomerRoutingModule { }
