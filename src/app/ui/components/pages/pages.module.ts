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
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PasswordModule } from 'primeng/password';
import { ImageModule } from 'primeng/image';
import { CustomerBasicEditComponent } from './third-party/customer/customer-basic-edit.component';
import { CustomerCommercialEditComponent } from './third-party/customer/customer-commercial-edit.component';
import { CustomerBuildingsListComponent } from './third-party/customer/customer-buildings-list.component';
import { CustomerBuildingsEditComponent } from './third-party/customer/customer-buildings-edit.component';
import { CustomerTransportersListComponent } from './third-party/customer/customer-transporters-list.component';
import { CustomerShippingListComponent } from './third-party/customer/customer-shipping-list.component';
import { CustomerShippingEditComponent } from './third-party/customer/customer-shipping-edit.component';
import { TransporterRouteListComponent } from './third-party/transporter/transporter-route-list.component';
import { TransporterDocumentListComponent } from './third-party/transporter/transporter-document-list.component';
import { TransporterVehicleListComponent } from './third-party/transporter/transporter-vehicle-list.component';
import { TransporterDriverListComponent } from './third-party/transporter/transporter-driver-list.component';
import { DriverComponent } from './third-party/driver/driver.component';
import { DriverGeneralInfoComponent } from './third-party/driver/driver-general-info.component';
import { UserListComponent } from './security/user/user-list.component';
import { UserEditComponent } from './security/user/user-edit.component';
import { UserProfileComponent } from './security/user/user-profile.component';
import { UserProfileEditComponent } from './security/user/user-profile-edit.component';
import { ProfileModuleComponent } from './security/user/profile-module.component';
import { ParametersComponent } from './security/parameters/parameters.component';
import { ParametersEditComponent } from './security/parameters/parameters-edit.component';
import { ProviderComponent } from './third-party/provider/provider.component';
import { ProviderPricesComponent } from './third-party/provider/provider-prices.component';


@NgModule({
    declarations: [
        TransporterComponent,
        CustomerComponent,
        GridThirdPartyComponent,
        CustomerBasicEditComponent,
        CustomerCommercialEditComponent, 
        CustomerBuildingsListComponent, 
        CustomerBuildingsEditComponent, 
        CustomerTransportersListComponent, 
        CustomerShippingListComponent, 
        CustomerShippingEditComponent,
        TransporterRouteListComponent,
        TransporterDocumentListComponent,
        TransporterVehicleListComponent,
        TransporterDriverListComponent,
        DriverComponent,
        DriverGeneralInfoComponent,
        UserListComponent,
        UserEditComponent,
        UserProfileComponent,
        UserProfileEditComponent,
        ProfileModuleComponent,
        ParametersComponent,
        ParametersEditComponent,
        ProviderComponent,
        ProviderPricesComponent

    ],
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
        FieldsetModule,
        FileUploadModule,
        InputTextareaModule,
        CalendarModule,
        OverlayPanelModule,
        PasswordModule,
        ImageModule
    ]
})
export class PagesModule { }
