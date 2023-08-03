import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { order } from 'src/app/ui/models/order.model';
import { OrderService } from 'src/app/ui/service/order.service';
import { OrderEditComponent } from './order-edit.component';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [MessageService]
})
export class OrderListComponent implements OnInit {
    @Input()feature!: string;
    @ViewChild(OrderEditComponent)editBasic!: OrderEditComponent;
    @ViewChild("dt")dataTableComponent!: Table;
    @ViewChild("saveBt")saveBtn!: Button;
    orders: order[] = [];
    order : order = {};
    cols: any[] = [];
    orderDialog = false;
    showOptions: boolean = true;
    canRead: boolean = true;
    canCreate: boolean = true;
    canEdit: boolean = true;
    editMode: boolean = false;
    isViewMode: boolean = false;
    orderId: number= 0;
    disabledSave: boolean = false;
    customers: CustomerBasicInfo[] = []
    saveLabel: string = '';
    deleteDialog: boolean = false;
    allowApproveAll: boolean = false;
    constructor(private orderService: OrderService, private customerService: CustomerService, private messageService: MessageService) { }
  
    ngOnInit() {
      //this.canRead = Common.checkPermissions('Maestros-Materiales', 'Consultar');
      //this.canCreate = Common.checkPermissions('Maestros-Materiales', 'Crear');
      //this.canEdit = Common.checkPermissions('Maestros-Materiales', 'Editar');
      this.getCustomerList();
      this.getGridData();
      this.cols = [
          { field: 'startDate', header: 'Fecha Inicial' },
          { field: 'buildingName', header: 'Obra' },
          { field: 'materialName', header: 'Material' },
          { field: 'clientName', header: 'Cliente' },
          { field: 'totalAmount', header: 'Cantidad Total' },
          { field: 'aprobeAmount', header: 'Cantidad Aprobada' },
          { field: 'monday', header: 'Lunes' },
          { field: 'tuesday', header: 'Martes' },
          { field: 'wednesday', header: 'Miércoles' },
          { field: 'thursday', header: 'Jueves' },
          { field: 'friday', header: 'Viernes' },
          { field: 'saturday', header: 'Sábado' },
          { field: 'sunday', header: 'Domingo' },
          { field: 'state', header: 'Estado' }
      ];
      this.canCreate = this.feature === 'approve' ? false: true;
      this.canEdit = this.feature === 'approve' ? false: true;
      this.saveLabel = this.feature === 'approve' ? 'Aprobar': 'Guardar';
    }

    reloadSave(event: any){
      this.disabledSave = event.disabledSave;
    }

    

  setup(val: Date){
    if (val != null) {
      let date = ((val.getMonth() > 8) ? (val.getMonth() + 1) : ('0' + (val.getMonth() + 1))) + '/' + ((val.getDate() > 9) ? val.getDate() : ('0' + val.getDate())) + '/' + val.getFullYear();
      this.dataTableComponent.filters["startDateFormat"] = [{value: date, matchMode: "equals"}];
    }
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
  
    getGridData(){
      this.orderService.getOrders()
      .subscribe({
          next: (data:any) => {
            this.orders = data;
            let existPending = this.orders.find(x => x.state === 'Pendiente')
            if (existPending !== null && existPending !== undefined){
              this.allowApproveAll = true;
            }
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
      this.order = {};
      this.showOptions = true;
    }
  
    editOrder(orderBasic: any) {
      this.editMode= true;
      this.orderId = orderBasic.id as number;
      this.orderDialog = true;
      this.order = orderBasic;
    }

    removeTime(date = new Date()) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }
  
    save(){
      if(this.feature === 'approve'){
        this.approveOrder();
      }else
      {
        this.saveOrder();
      }
    }

    approveOrder(){
      if (this.editBasic.formGroupBasic.invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
        return;
      }
      let ids: number[] = []
      ids.push(this.orderId);
      let formValues  = this.editBasic.f;
      this.orderService.putApprove(ids, formValues.amountApprove.value)
      .subscribe({
          next: (data) => {
            if(data)
            {
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Aprobado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }

  
    saveOrder(){
      this.editBasic.submittedBasic = true;
      if (this.editBasic.formGroupBasic.invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
        return;
      }
      let formValues  = this.editBasic.f;
      let objBasic: order = {
        startDate: formValues.startDateSelected.value,
        buildingId: formValues.buildingSelected.value,
        materialId: formValues.materialSelected.value,
        monday: formValues.monday.value,
        tuesday: formValues.tuesday.value,
        wednesday: formValues.wednesday.value,
        thursday: formValues.thursday.value,
        friday: formValues.friday.value,
        saturday: formValues.saturday.value,
        sunday: formValues.sunday.value,
        totalAmount: formValues.totalAmount.value,
        aprobeAmount: formValues.totalAmount.value,
        state: ''
      }
      if (this.editMode){
        objBasic.id = this.orderId;
        objBasic.state = formValues.state.value;
        this.orderService.putOrder(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.orderDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Actualizado', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
      }else{
        objBasic.state = 'Pendiente';
        this.orderService.postOrder(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.orderDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Creado', life: 3000 });
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

    approveAll(){
      let ids: number[] = []
      this.orders.forEach((element) => {
        ids.push(element.id as number)
      } );
      this.orderService.putApprove(ids, 0)
      .subscribe({
          next: (data) => {
            if(data)
            {
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Todos los Pedidos fueron Aprobados', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }
    reject (orderBasic: any)
    {
      this.order = orderBasic;
      this.deleteDialog = true;
    } 

    confirmRejectSelected()
    {
      let objBasic: order = this.order;
      objBasic.state = 'Rechazado';
      this.orderService.putOrder(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.deleteDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pedido Rechazado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }
  }
