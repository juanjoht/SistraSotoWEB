import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaterialListComponent } from './material-list.component';

@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: MaterialListComponent }
	])],
	exports: [RouterModule]
})
export class MaterialRoutingModule { }
