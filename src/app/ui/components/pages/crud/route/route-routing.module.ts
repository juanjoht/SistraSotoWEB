import { NgModule } from '@angular/core';
import { RouteModule } from './route.module';
import { RouteListComponent } from './route-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: RouteListComponent }
	])],
	exports: [RouterModule]
})
export class RouteRoutingModule { }
