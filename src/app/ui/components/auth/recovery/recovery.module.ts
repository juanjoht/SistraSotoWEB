import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { RecoveryRoutingModule } from './recovery-routing.module';
import { ToastModule } from 'primeng/toast';
import { RecoveryComponent } from './recovery.component';


@NgModule({
  declarations: [RecoveryComponent],
  imports: [
    CommonModule,
    RecoveryRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule,
    ToastModule
  ]
})
export class RecoveryModule { }
