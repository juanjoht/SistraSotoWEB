import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService, LazyLoadEvent  } from 'primeng/api';
import { order } from 'src/app/ui/models/order.model';
import { OrderService } from 'src/app/ui/service/order.service';
import { OrderEditComponent } from './order-edit.component';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { CustomerBasicInfo, CustomerBuildings } from 'src/app/ui/models/customer.model';
import { Table } from 'primeng/table';
import { Button } from 'primeng/button';
import { FactoryService } from 'src/app/ui/service/factory.service';
import { factory } from 'src/app/ui/models/factory.model';
import { MaterialService } from 'src/app/ui/service/material.service';
import { material } from 'src/app/ui/models/material.model';
import { params } from 'src/app/ui/models/param.model';
import { ParamService } from 'src/app/ui/service/param.service';

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
    page: number = 1;
    first: number = 0;
    rows: number = 10;
    totalRecords: number = 0;
    filter: string = '';
    sort: string = '';
    sortAsc: boolean = false;
    orders: order[] = [];
    order : order = {};
    cols: any[] = [];
    orderDialog = false;
    showOptions: boolean = true;
    canRead: boolean = true;
    canCreate: boolean = true;
    canEdit: boolean = true;
    editMode: boolean = false;
    editAproveMode: boolean = false;
    isViewMode: boolean = false;
    orderId: number= 0;
    disabledSave: boolean = false;
    customers: CustomerBasicInfo[] = [];
    allFactories: factory[] = [];
    allBuildings: CustomerBuildings[] = [];
    materials: material[] = [];
    states: params[] = [];
    saveLabel: string = '';
    deleteDialog: boolean = false;
    allowApproveAll: boolean = false;
    constructor(private orderService: OrderService, private paramService: ParamService, private materialService:MaterialService, private factoryService:FactoryService,private customerService: CustomerService, private messageService: MessageService) { }
  
    ngOnInit() {
      //this.canRead = Common.checkPermissions('Maestros-Materiales', 'Consultar');
      //this.canCreate = Common.checkPermissions('Maestros-Materiales', 'Crear');
      //this.canEdit = Common.checkPermissions('Maestros-Materiales', 'Editar');
      this.getCustomerList();
      this.getAllFactories();
      this.getAllBuildings();
      this.getMaterials();
      this.getStates();
      this.getGridData();
      this.cols = [
          { field: 'id', header: 'Nro Ped' },
          { field: 'startDate', header: 'Fecha' },
          { field: 'aut', header: 'Aut' },
          { field: 'factoryName', header: 'Planta' },
          { field: 'buildingName', header: 'Obra' },
          { field: 'materialName', header: 'Material' },
          { field: 'UnitMeasure', header: 'Unidad Medida' },
          { field: 'clientName', header: 'Cliente' },
          { field: 'requestAmount', header: 'Cantidad Pedida' },
          { field: 'aprobeAmount', header: 'Cantidad Aprobada' },
          { field: 'deliveredAmount', header: 'Cantidad Despachada' },
          { field: 'state', header: 'Estado' }
      ];
      this.canCreate = this.feature === 'approve' ? false: true;
      //this.canEdit = this.feature === 'approve' ? false: true;
      this.saveLabel = this.editAproveMode ? 'Aprobar': 'Guardar';
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
  sortM: any[] = []
  customSort(e: LazyLoadEvent){
    this.sortAsc = e.sortOrder === 1 ? false : true;
    switch (e.sortField) {
        case 'startDate':
          this.sort = "Fecha" 
        break;
        case 'aut':
          this.sort = "Automatico" 
        break;
        case 'factoryName':
          this.sort = "PlantaId" 
        break;
        case 'buildingName':
          this.sort = "ObraId" 
        break;
        case 'materialName':
          this.sort = "MaterialId" 
        break;
        case 'UnitMeasure':
          this.sort = "UnidadMedida" 
        break;
        case 'clientName':
          this.sort = "Cliente" 
        break;
        case 'requestAmount':
          this.sort = "cantidadPedida" 
        break;
        case 'aprobeAmount':
          this.sort = "cantidadAprobada" 
        break;
        case 'deliveredAmount':
          this.sort = "cantidadDespachada" 
        break;
        case 'state':
          this.sort = "Estado" 
          break;
      default:
        this.sort = 'Id'
        break;
    }
    this.getGridData();
  }

  filterM: any[]= [];
  filterQuery(values: any, type: string)
  {
    this.filter = '';
    if(values !== null)
    {
      if(type === 'fecha')
      {
        const yyyy = values.getFullYear();
        let mm = values.getMonth() + 1; // Months start at 0!
        let dd = values.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm; 
        values = mm + '/' + dd + '/' + yyyy;
      }
    }
      
      let curretFilter = `&filters[${type}]=${values}`
      let existfilterType = this.filterM.length !==0 ? this.filterM.find(x =>x.type === type) : undefined;
      if(existfilterType === undefined)
      {
        this.filterM.push({filter: curretFilter, type : type});
      }else
      {
        if (values === null)
        {
          const index = this.filterM.indexOf(existfilterType);
          if (index > -1) {
            this.filterM.splice(index, 1);
          }
        }else
          existfilterType.filter = curretFilter
      }

      for (var a = 0; a < this.filterM.length; a++) {
        this.filter += this.filterM[a].filter;
      }
    
    this.getGridData();
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

    getAllFactories(){
      this.factoryService.getFactory()
      .subscribe({
          next: (data:any) => {
            this.allFactories = data;
          },
          error: (error: { message: any; }) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }

    getAllBuildings(){
      this.customerService.getBuildings()
      .subscribe({
          next: (data:any) => {
            this.allBuildings = data;
          },
          error: (error: { message: any; }) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }

    getMaterials(){
      this.materialService.getMaterial()
      .subscribe({
          next: (data:any) => {
            this.materials = data;
          },
          error: (error: { message: any; }) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }

    getStates(){
      this.paramService.getParamByType('Estados Pedido')
              .subscribe({
                  next: (data:any) => {
                    this.states = data;
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });                  
                  }
              });
    }
    

    onPageChange(event:any) {
      this.page = event.page + 1;
      this.first = event.first;
      this.rows = event.rows;
      this.getGridData();
  }

  
    getGridData(){
      setTimeout(() => {
      this.orderService.getOrders(this.page,this.rows, this.sort, this.sortAsc, this.filter)
      .subscribe({
          next: (data:any) => {
            this.orders = data.orders;
            this.totalRecords = data.pageInf.totalItems;;
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
      }, 1000);
    }
  
    openNew(){
      this.orderDialog = true;
      this.editMode= false;
      this.order = {};
      this.showOptions = true;
    }
  
    editOrder(orderBasic: any, isApproving: boolean) {
      this.editMode= isApproving ? false: true;
      this.editAproveMode = isApproving;
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
      if(this.editAproveMode){
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
              this.orderDialog = false;
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
        factoryId: formValues.factorySelected.value,
        buildingId: formValues.buildingSelected.value,
        materialId: formValues.materialSelected.value,
        UnitMeasure: formValues.measureUnitSelected.value,
        automatic: formValues.automatic.value,
        monday: formValues.monday.value,
        tuesday: formValues.tuesday.value,
        wednesday: formValues.wednesday.value,
        thursday: formValues.thursday.value,
        friday: formValues.friday.value,
        saturday: formValues.saturday.value,
        sunday: formValues.sunday.value,
        totalAmount: formValues.totalAmount.value,
        state: ''
      }
      if (this.editMode){
        objBasic.id = this.orderId;
        objBasic.state = formValues.state.value;
        objBasic.aprobeAmount= formValues.amountApprove.value;
        objBasic.deliveredAmount= formValues.deliverApprove.value;
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
