import { CustomerComponent } from './customer.component';
import { CustomerBasicEditComponent } from './customer-basic-edit.component';
import { CustomerCommercialEditComponent } from './customer-commercial-edit.component';
import { CustomerBuildingsListComponent } from './customer-buildings-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerRoutingModule } from './customer-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
@NgModule({
  declarations: [CustomerComponent,CustomerBasicEditComponent, CustomerCommercialEditComponent, CustomerBuildingsListComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    RatingModule,
    ToastModule,
    InputTextModule,
    TabViewModule,
    DialogModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule
  ]
})
export class CustomerModule { }
