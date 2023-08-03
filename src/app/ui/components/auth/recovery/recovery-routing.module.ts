import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecoveryComponent } from './recovery.component';



@NgModule({
  imports: [RouterModule.forChild([
      { path: '', component: RecoveryComponent }
  ])],
  exports: [RouterModule]
})
export class RecoveryRoutingModule { }
