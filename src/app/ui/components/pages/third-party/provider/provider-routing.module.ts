import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProviderComponent } from './provider.component';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: ProviderComponent }
	])],
	exports: [RouterModule]
})
export class ProviderRoutingModule { }
