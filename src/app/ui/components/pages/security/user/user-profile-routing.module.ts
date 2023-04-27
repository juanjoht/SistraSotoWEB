import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';



@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: UserProfileComponent }
	])],
	exports: [RouterModule]
})
export class UserProfileRoutingModule { }
