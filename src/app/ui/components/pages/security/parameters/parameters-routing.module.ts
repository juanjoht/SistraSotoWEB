import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParametersComponent } from './parameters.component';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: ParametersComponent }
	])],
	exports: [RouterModule]
})
export class ParametersRoutingModule { }
