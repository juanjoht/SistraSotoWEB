import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { order } from 'src/app/ui/models/order.model';
import { OrderService } from 'src/app/ui/service/order.service';
import { OrderEditComponent } from './order-edit.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [MessageService]
})
export class OrderListComponent implements OnInit {
    @ViewChild(OrderEditComponent)editBasic!: OrderEditComponent;
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

    constructor(private orderService: OrderService, private messageService: MessageService) { }
  
    ngOnInit() {
      //this.canRead = Common.checkPermissions('Maestros-Materiales', 'Consultar');
      //this.canCreate = Common.checkPermissions('Maestros-Materiales', 'Crear');
      //this.canEdit = Common.checkPermissions('Maestros-Materiales', 'Editar');
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
    }

    reloadSave(event: any){
      this.disabledSave = event.disabledSave;
    }
  
    getGridData(){
      this.orderService.getOrders()
      .subscribe({
          next: (data:any) => {
            this.orders = data;
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
        state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
      }
      if (this.editMode){
        objBasic.id = this.orderId;
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
  }
