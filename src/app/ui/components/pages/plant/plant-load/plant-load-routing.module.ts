import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlantLoadComponent } from './plant-load.component';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: PlantLoadComponent }
	])],
	exports: [RouterModule]
})

export class PlantLoadRoutingModule { }
