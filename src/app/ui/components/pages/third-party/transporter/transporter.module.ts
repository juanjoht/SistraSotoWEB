import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridThirdPartyComponent } from '../grid-third-party/grid-third-party.component';
import { TransporterComponent } from './transporter.component';
import { TransporterRoutingModule } from './transporter-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CustomerRoutingModule } from '../customer/customer-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TransporterRoutingModule
  ]
})
export class TransporterModule { }
