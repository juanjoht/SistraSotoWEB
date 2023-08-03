import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';
import { providerOrder } from 'src/app/ui/models/order.model';
import { ProviderBasicInfo } from 'src/app/ui/models/provider.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { OrderService } from 'src/app/ui/service/order.service';
import { ProviderService } from 'src/app/ui/service/provider.service';
import { ProviderOrderEditComponent } from './provider-order-edit.component';

@Component({
  selector: 'app-provider-order-list',
  templateUrl: './provider-order-list.component.html',
  styleUrls: ['./provider-order-list.component.scss'],
  providers: [MessageService]
})
export class ProviderOrderListComponent implements OnInit {
  @ViewChild(ProviderOrderEditComponent)editBasic!: ProviderOrderEditComponent;

  providerOrders: providerOrder[] = [];
  providerOrder : providerOrder = {};
  cols: any[] = [];
  orderDialog = false;
  showOptions: boolean = true;
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  editMode: boolean = false;
  providerOrderId: number= 0;
  disabledSave: boolean = false;
  customers: CustomerBasicInfo[] = [];
  providers: ProviderBasicInfo[] = [];
  customersBuildings: any[] = [];
  clientID : number = 0;

  constructor(private orderService: OrderService, private customerService: CustomerService,private providerService: ProviderService, private messageService: MessageService) { }

  ngOnInit() {
    //this.canRead = Common.checkPermissions('Maestros-Materiales', 'Consultar');
    //this.canCreate = Common.checkPermissions('Maestros-Materiales', 'Crear');
    //this.canEdit = Common.checkPermissions('Maestros-Materiales', 'Editar');
    this.getCustomerList();
    this.getProviderList();
    this.getGridData();
    this.cols = [
        { field: 'shipmentDate', header: 'Fecha Despacho' },
        { field: 'providerName', header: 'Proveedor' },
        { field: 'clientName', header: 'Cliente' },
        { field: 'buildingName', header: 'Obra' },
        { field: 'materialName', header: 'Material' },
        { field: 'amount', header: 'Cantidad' },
        { field: 'state', header: 'Estado' }
    ];
  }

  getCustomerList(){
    this.customerService.getCustomerBasic()
    .subscribe({
        next: (data:any) => {
          this.customers = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  getProviderList(){
    this.providerService.getProvider()
    .subscribe({
        next: (data:any) => {
          this.providers = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  getBuildingsByClient(clientId: number){
    this.customerService.getBuildingsByClient(clientId)
    .subscribe({
        next: (data:any) => {
          this.customersBuildings = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  getClientId(data: CustomerBasicInfo[], name: any){
    return data.find(x=> x.name === name)?.id
  }

  changeClient(event: any){
    this.clientID = this.getClientId(this.customers, event.value) as number;
    this.getBuildingsByClient(this.clientID);  
  }

  getGridData(){
    this.orderService.getProviderOrders()
    .subscribe({
        next: (data:any) => {
          this.providerOrders = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  openNew(){
    this.orderDialog = true;
    this.editMode= false;
    this.providerOrder = {};
    this.showOptions = true;
  }

  editOrder(orderBasic: any) {
    this.editMode= true;
    this.providerOrderId = orderBasic.id as number;
    this.orderDialog = true;
    this.providerOrder = orderBasic;
  }

  removeTime(date = new Date()) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  saveOrder(){
    this.editBasic.submittedBasic = true;
      if (this.editBasic.formGroupBasic.invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
        return;
      }
      let formValues  = this.editBasic.f;
      let objBasic: providerOrder = {
        shipmentDate: formValues.shippingDateSelected.value,
        providerId: formValues.providerSelected.value,
        buildingId: formValues.buildingSelected.value,
        materialId: formValues.materialSelected.value,
        amount: formValues.amount.value,
        state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
      }
      if (this.editMode){
        objBasic.id = this.providerOrderId;
        this.orderService.putProviderOrder(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.orderDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Proveedor Actualizado', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
      }else{
        this.orderService.postProviderOrder(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.orderDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Proveedor Creado', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
      }
  }

  
  hideDialog(){
    this.orderDialog = false;
    this.editBasic.submittedBasic = false;
  }

}
