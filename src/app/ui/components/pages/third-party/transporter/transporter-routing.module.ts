import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransporterComponent } from './transporter.component';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: TransporterComponent }
	])],
	exports: [RouterModule]
})
export class TransporterRoutingModule { }
