import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DriverComponent } from './driver.component';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: DriverComponent }
	])],
	exports: [RouterModule]
})
export class DriverRoutingModule { }
