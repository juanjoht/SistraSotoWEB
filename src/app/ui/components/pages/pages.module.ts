import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { CustomerComponent } from './third-party/customer/customer.component';
import { GridThirdPartyComponent } from './third-party/grid-third-party/grid-third-party.component';
import { TransporterComponent } from './third-party/transporter/transporter.component';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { CustomerBasicEditComponent } from './third-party/customer/customer-basic-edit.component';
import { CustomerCommercialEditComponent } from './third-party/customer/customer-commercial-edit.component';
import { CustomerBuildingsListComponent } from './third-party/customer/customer-buildings-list.component';
import { CustomerBuildingsEditComponent } from './third-party/customer/customer-buildings-edit.component';
import { CustomerTransportersListComponent } from './third-party/customer/customer-transporters-list.component';
import { CustomerShippingListComponent } from './third-party/customer/customer-shipping-list.component';
import { CustomerShippingEditComponent } from './third-party/customer/customer-shipping-edit.component';
@NgModule({
    declarations: [TransporterComponent,CustomerComponent,GridThirdPartyComponent,CustomerBasicEditComponent, CustomerCommercialEditComponent, CustomerBuildingsListComponent, CustomerBuildingsEditComponent, CustomerTransportersListComponent, CustomerShippingListComponent, CustomerShippingEditComponent],
    imports: [
        CommonModule,
        PagesRoutingModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        TableModule,
        ButtonModule,
        RippleModule,
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
    ]
})
export class PagesModule { }
