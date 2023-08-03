import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerLicensePlate } from 'src/app/ui/models/customer.model';
import { preassignment } from 'src/app/ui/models/preassignment.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { PreassignmentService } from 'src/app/ui/service/preassignment.service';
import { PreassignmentEditComponent } from './preassignment-edit.component';
import * as FileSaver from 'file-saver';

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
  customerPlates : CustomerLicensePlate[] = [];
  clientID : number = 0;
  allowApproveAll: boolean = false;
  deleteDialog: boolean = false;
  preassignmentId: number= 0;
  saveLabel: string = 'Guardar';
  action: string = "Crear";
  constructor(private preassignmentService: PreassignmentService, private customerService: CustomerService, private messageService: MessageService) { }

  ngOnInit() {
    //this.canRead = Common.checkPermissions('Maestros-Materiales', 'Consultar');
    //this.canCreate = Common.checkPermissions('Maestros-Materiales', 'Crear');
    //this.canEdit = Common.checkPermissions('Maestros-Materiales', 'Editar');
    this.getCustomerList();
    this.getGridData();
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

  
  getLicensePlateByClient(clientId: number){
    this.customerService.getLicensePlatesByClient(clientId)
    .subscribe({
        next: (data:any) => {
          this.customerPlates = data;
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
    this.getLicensePlateByClient(this.clientID);
  }

  getGridData(){
    this.preassignmentService.getPreassignment()
    .subscribe({
        next: (data:any) => {
          this.preassignments = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  openNew(){
    this.preassignmentDialog = true;
    this.editMode= false;
    this.preassignment = {};
    this.showOptions = true;
    this.action = 'Crear';
  }

  edit(preassignment: any, action: string) {
    this.editMode= true;
    this.preassignmentId = preassignment.id as number;
    this.preassignmentDialog = true;
    this.preassignment = preassignment;
    this.action = action;
    if (action === 'Editar'){
      this.saveLabel = 'Guardar'
    }else
    {
      this.saveLabel = action;
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
        serviceDate: formValues.dateSelected.value,
        buildingId: formValues.buildingSelected.value,  
        materialId: formValues.materialSelected.value,
        measureUnit: formValues.unitMeasure.value,
        amount: formValues.amount.value,
        vehicleId:  formValues.plateSelected.value,
        driverId: formValues.driverSelected.value,
        state : formValues.state.value
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
