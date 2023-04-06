import { CustomerComponent } from './customer.component';
import { CustomerBasicEditComponent } from './customer-basic-edit.component';
import { CustomerCommercialEditComponent } from './customer-commercial-edit.component';
import { CustomerBuildingsListComponent } from './customer-buildings-list.component';
import { CustomerBuildingsEditComponent } from './customer-buildings-edit.component';
import { CustomerTransportersListComponent } from './customer-transporters-list.component';
import { CustomerShippingListComponent } from './customer-shipping-list.component';
import { CustomerShippingEditComponent } from './customer-shipping-edit.component';
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
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { GridThirdPartyComponent } from '../grid-third-party/grid-third-party.component';


@NgModule({
  declarations: [],
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
    InputNumberModule,
    CheckboxModule,
    FieldsetModule
  ],
  exports:[
  ]
})
export class CustomerModule { }
