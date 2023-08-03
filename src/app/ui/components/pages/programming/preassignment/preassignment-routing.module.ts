import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreassignmentListComponent } from './preassignment-list.component';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: PreassignmentListComponent }
	])],
	exports: [RouterModule]
})
export class PreassignmentRoutingModule { }
