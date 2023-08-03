import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProviderOrderListComponent } from './provider-order-list.component';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: ProviderOrderListComponent }
	])],
	exports: [RouterModule]
})
export class ProviderOrderRoutingModule { }
