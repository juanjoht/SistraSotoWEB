import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerShipping } from 'src/app/ui/models/customer.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { CustomerShippingEditComponent } from './customer-shipping-edit.component';
import { TransporterService } from 'src/app/ui/service/transporter.service';

@Component({
  selector: 'app-customer-shipping-list',
  templateUrl: './customer-shipping-list.component.html',
  styleUrls: ['./customer-shipping-list.component.scss']
})
export class CustomerShippingListComponent implements OnInit {
  @Input() feature: string = '';
  @Input() clientName: string = '';
  @Input() clientId: number = 0;
  @Input() viewMode: boolean = false;
  @Input() unit:string = '';
  @ViewChild(CustomerShippingEditComponent)editShipping!: CustomerShippingEditComponent;

  customersShippingRate: CustomerShipping[] = [];
  customerShippingRate: CustomerShipping = {};
  customerShippingRateDialog: boolean = false;
  cols: any[] = [];
  editMode: boolean = false;
  shippingId: number = 0;
  constructor(
    private customerService: CustomerService,
    private transporterService: TransporterService,
    private messageService: MessageService) { }

  ngOnInit() {
    if(this.feature.toLowerCase() === 'cliente'){
      this.getGridDataCustomer();
    }
    else if (this.feature.toLowerCase() === 'transportador')
    {
       this.getGridDataTransporter(); 
    }
   

    this.cols = [
        { field: 'route', header: 'Ruta' },
        { field: 'material', header: 'Material' },
        { field: 'm3Value', header: 'Valor m3' },
        { field: 'tonValue', header: 'Valor ton' }
    ];
  }

  openNewShippingRate()
  {
    this.customerShippingRateDialog = true;
  }

  editCustomerShipping(customerShipping: CustomerShipping) {
    this.customerShippingRateDialog = true;
    this.editMode = true;
    this.customerShippingRate  = customerShipping;
    this.shippingId = customerShipping.id as number;
  }

  hideDialog()
  {
    this.customerShippingRateDialog = false;
    this.editShipping.submittedShippingRate = false;
  }

  getGridDataCustomer(){
    this.customerService.getShippingRatesByThirdParty(this.clientId)
    .subscribe({
        next: (data:any) => {
          this.customersShippingRate = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
          console.log(error);
        }
    });
  }

  getGridDataTransporter(){
    this.transporterService.getShippingRatesByTransporter(this.clientId)
    .subscribe({
        next: (data:any) => {
          this.customersShippingRate = data;
        },
        error: error => {
          if (error.error.title !== 'TransportadorTarifaFlete no encontrado')
          {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
          }
        }
    });
  }

  saveContentDialog()
  {
    if(this.feature.toLowerCase() === 'cliente'){
      this.saveCustomerShipping()
    }
    else if (this.feature.toLowerCase() === 'transportador')
    {
       this.saveTransporterShipping(); 
    }
  }

  saveCustomerShipping()
  {
    this.editShipping.submittedShippingRate = true;
    if (this.editShipping.formGroupShippingRate.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editShipping.f;

    let objShipping: CustomerShipping = {
      customerId: this.clientId,
      routeId: formValues.routeSelected.value,
      materialId: formValues.materialSelected.value,
      m3Value: formValues.m3Value.value,
      tonValue : formValues.tonValue.value,
      state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
    }
      
    
    if (this.editMode){
      objShipping.id = this.shippingId;
      this.customerService.putCustomerShipping(objShipping, this.clientId)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.customerShippingRateDialog = false;
              this.getGridDataCustomer();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tarifa Flete del Cliente Actualizada', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }else{
      this.customerService.postCustomerShipping(objShipping)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.customerShippingRateDialog = false;
                      this.getGridDataCustomer();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tarifa Flete del Cliente Creada', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                    console.log(error);
                  }
              });
      }
  }

  saveTransporterShipping()
  {
    this.editShipping.submittedShippingRate = true;
    if (this.editShipping.formGroupShippingRate.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editShipping.f;
    let objShipping: CustomerShipping = {
      customerId: this.clientId,
      routeId: formValues.routeSelected.value,
      materialId: formValues.materialSelected.value,
      state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
    }
    if(this.feature.toLowerCase() === 'transportador'){
      objShipping.m3Value = formValues.m3Value.value;
      objShipping.tonValue = formValues.tonValue.value;
    }

    if (this.editMode){
      objShipping.id = this.shippingId;
      this.transporterService.putTransporterShipping(objShipping,this.clientId)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.customerShippingRateDialog = false;
              this.getGridDataTransporter();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tarifa Flete del Transportador Actualizada', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }else{
      this.transporterService.postTransporterShipping(objShipping)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.customerShippingRateDialog = false;
                      this.getGridDataTransporter();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tarifa Flete del Transportador Creada', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });
      }
  }


}
