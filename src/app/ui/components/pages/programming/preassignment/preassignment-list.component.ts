import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerLicensePlate } from 'src/app/ui/models/customer.model';
import { preassignment } from 'src/app/ui/models/preassignment.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { PreassignmentService } from 'src/app/ui/service/preassignment.service';
import { PreassignmentEditComponent } from './preassignment-edit.component';
import * as FileSaver from 'file-saver';
import { VehicleService } from 'src/app/ui/service/vehicle.service';
import { VehiclePlate } from 'src/app/ui/models/vehicles.model';

@Component({
  selector: 'app-preassignment-list',
  templateUrl: './preassignment-list.component.html',
  styleUrls: ['./preassignment-list.component.scss'],
  providers: [MessageService]
})
export class PreassignmentListComponent implements OnInit {
  @ViewChild(PreassignmentEditComponent)editBasic!: PreassignmentEditComponent;

  preassignments: preassignment[] = [];
  preassignment : preassignment = {};
  page: number = 1;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  filter: string = '';
  sort: string = '';
  sortAsc: boolean = false;
  cols: any[] = [];
  preassignmentDialog = false;
  showOptions: boolean = true;
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  editMode: boolean = false;
  disabledSave: boolean = false;
  customers: CustomerBasicInfo[] = [];
  customersBuildings: any[] = [];
  vehicles: VehiclePlate[] = [];  clientID : number = 0;
  allowApproveAll: boolean = false;
  deleteDialog: boolean = false;
  preassignmentId: number= 0;
  orderId?: number;
  saveLabel: string = 'Guardar';
  action: string = "Crear";
  constructor(private preassignmentService: PreassignmentService, private vehicleService: VehicleService, private customerService: CustomerService, private messageService: MessageService) { }

  ngOnInit() {
    //this.canRead = Common.checkPermissions('Maestros-Materiales', 'Consultar');
    //this.canCreate = Common.checkPermissions('Maestros-Materiales', 'Crear');
    //this.canEdit = Common.checkPermissions('Maestros-Materiales', 'Editar');
    this.getCustomerList();
    this.getGridData();
    this.getAllVehicles();
    this.cols = [
        { field: 'serviceDate', header: 'Fecha' },
        { field: 'serviceHour', header: 'Hora Cargue' },
        { field: 'vehiclePlate', header: 'Placa' },
        { field: 'driverName', header: 'Conductor' },
        { field: 'clientName', header: 'Cliente' },
        { field: 'buildingName', header: 'Obra' },
        { field: 'materialName', header: 'Material' },
        { field: 'measureUnit', header: 'Unidad de Medida' },
        { field: 'amount', header: 'Cantidad' },
        { field: 'factoryName', header: 'Planta' },
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

  

  
  getAllVehicles(){
    this.vehicleService.getVehiclePlate()
    .subscribe({
        next: (data:any) => {
          this.vehicles = data;
        },
        error: (error: { message: any; }) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }


  getClientId(data: CustomerBasicInfo[], name: any){
    return data.find(x=> x.id === name)?.id
  }

  changeClient(event: any){
    this.clientID = event.value as number;
    this.getBuildingsByClient(this.clientID);  
  }

  sortM: any[] = []
  customSort(e: LazyLoadEvent){
    this.sortAsc = e.sortOrder === 1 ? false : true;
    switch (e.sortField) {
        case 'serviceDate':
          this.sort = "FechaServicio" 
        break;
        case 'serviceHour':
          this.sort = "Hora" 
        break;
        case 'clientName':
          this.sort = "ClienteId" 
        break;
        case 'buildingName':
          this.sort = "ObraId" 
        break;
        case 'vehiclePlate':
          this.sort = "Placa" 
        break;
        case 'driverName':
          this.sort = "ConductorId" 
        break;
        case 'materialName':
          this.sort = "MaterialId" 
        break;
        case 'measureUnit':
          this.sort = "UnidadMedida" 
        break;
        case 'amount':
          this.sort = "Cantidad" 
        break;
        case 'factoryName':
          this.sort = "PlantaId" 
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
      if(type === 'fechaServicio')
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

  onPageChange(event:any) {
    this.page = event.page + 1;
    this.first = event.first;
    this.rows = event.rows;
    this.getGridData();
}


  getGridData(){
    setTimeout(() => {
    this.preassignmentService.getPreassignment(this.page,this.rows, this.sort, this.sortAsc, this.filter)
    .subscribe({
        next: (data:any) => {
          this.preassignments = data.preassignments;
          this.totalRecords = data.pageInf.totalItems;;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }, 1000);
  }

  openNew(){
    this.preassignmentDialog = true;
    this.editMode= false;
    this.preassignment = {};
    this.showOptions = true;
    this.action = 'Crear';
    this.saveLabel = 'Guardar'
  }

  edit(preassignment: any, option: string) {
    this.editMode= true;
    this.preassignmentId = preassignment.id as number;
    this.orderId = preassignment.orderId as number;
    this.preassignmentDialog = true;
    this.preassignment = preassignment;
    this.action = option;
    switch (option) {
      case 'Editar':
        this.saveLabel = 'Guardar'
      break;
      case 'RegistroNovedades':
        this.action = 'Registrar Novedad'
        this.saveLabel = 'Guardar'
      break;
      default:
        this.saveLabel = option;
        break;
    }
  }

  removeTime(date = new Date()) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }


  save(){
    this.editBasic.submittedBasic = true;
      if (this.editBasic.formGroupBasic.invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
        return;
      }
      let formValues  = this.editBasic.f;
      let objBasic: preassignment= {
        serviceDate: new Date(formValues.dateSelected.value.getTime() - formValues.dateSelected.value.getTimezoneOffset()*60*1000),
        buildingId: formValues.buildingSelected.value,  
        materialId: formValues.materialSelected.value,
        measureUnit: formValues.unitMeasure.value,
        amount: formValues.amount.value,
        vehicleId:  formValues.plateSelected.value,
        driverId: formValues.driverSelected.value,
        factoryId: formValues.factorySelected.value,
        state : formValues.state.value,
        orderId:  this.orderId
      }
      switch (this.action) {
        case 'Crear':
          objBasic.state = 'Pendiente Aprobación';
          this.preassignmentService.postPreassignment(objBasic)
          .subscribe({
              next: (data) => {
                if(data !== null)
                {
                  this.preassignmentDialog = false;
                  this.getGridData();
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Preasignación Creada', life: 3000 });
                }
              },
              error: error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
              }
          });
          break;
          case 'Editar':
            objBasic.id = this.preassignmentId;
            this.preassignmentService.putPreassignment(objBasic)
            .subscribe({
                next: (data) => {
                  if(data !== null)
                  {
                    this.preassignmentDialog = false;
                    this.getGridData();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Preasignación Actualizado', life: 3000 });
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                }
          });
          break;
          case 'RegistroNovedades':
            objBasic.id = this.preassignmentId;
            this.preassignmentService.putPreassignment(objBasic)
            .subscribe({
                next: (data) => {
                  if(data !== null)
                  {
                    this.preassignmentDialog = false;
                    this.getGridData();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Preasignación Actualizado', life: 3000 });
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                }
          });
          break;
          case 'Aprobar':
            let ids: number[] = []
            ids.push(this.preassignmentId);
            this.preassignmentService.putApprove(ids,objBasic.amount as number)
            .subscribe({
                next: (data) => {
                  if(data !== null)
                  {
                    this.preassignmentDialog = false;
                    this.getGridData();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Preasignación Aprobada', life: 3000 });
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                }
              });
          break;
          case 'Rechazar':
            objBasic.rejectionReason = formValues.reasonReject.value;
            this.preassignmentService.putReject(this.preassignmentId as number,objBasic.rejectionReason as string)
            .subscribe({
                next: (data) => {
                  if(data !== null)
                  {
                    this.preassignmentDialog = false;
                    this.getGridData();
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Preasignación Rechazada', life: 3000 });
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                }
              });  
          break;
        default:
          break;
      }
  }

  
  hideDialog(){
    this.preassignmentDialog = false;
    this.editBasic.submittedBasic = false;
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.preassignments);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "preassignments");
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {  
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

approveAll(){
  let ids: number[] = []
  this.preassignments.forEach((element) => {
    ids.push(element.id as number)
  } );
  this.preassignmentService.putApprove(ids, 0)
  .subscribe({
      next: (data) => {
        if(data)
        {
          this.getGridData();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Todas las preasignaciones fueron Aprobadas', life: 3000 });
        }
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
      }
  });
}
  

  


  
  



}
