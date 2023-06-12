import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Constants } from 'src/app/common/constants';
import { DriverDocument } from 'src/app/ui/models/driver.model';
import { params } from 'src/app/ui/models/param.model';
import { TransporterDocuments } from 'src/app/ui/models/transporter.model';
import { DriverService } from 'src/app/ui/service/driver.service';
import { ParamService } from 'src/app/ui/service/param.service';
import { TransporterService } from 'src/app/ui/service/transporter.service';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import { VehicleService } from 'src/app/ui/service/vehicle.service';
import { VehicleDocuments } from 'src/app/ui/models/vehicles.model';
import { Common } from 'src/app/common/common';
@Component({
  selector: 'app-transporter-document-list',
  templateUrl: './transporter-document-list.component.html',
  styleUrls: ['./transporter-document-list.component.scss']
})
export class TransporterDocumentListComponent implements OnInit {
  @Input() feature: string = '';
  @Input() transporterName: string = '';
  @Input() transporterId: number = 0;
  @Input() transporterDoc: string = '';
  @Input() viewMode: boolean = false;
  formTransporterDoc!: FormGroup;
  transporterDocs: TransporterDocuments[] = [];
  Docs: params[] = [];
  submittedTransporterDoc: boolean = false;
  validateTransporterDoc: boolean = false;
  transporterDocDialog: boolean = false;
  showVarCode = false;
  cols: any[] = [];
  action: string = "Adicionar";
  docName: string = '';
  showMatutityDate: boolean= false;
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  constructor(
    private parameterService: ParamService,
    private transporterService: TransporterService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    switch (this.feature.toLowerCase()) {
      case 'conductor':
        this.getGridDataDrivers();
        break;
      case 'transportador':
        this.getGridDataTransporters(); 
        break;
      case 'vehículo':
        this.canRead = Common.checkPermissions('Maestros-Vehiculos', 'Consultar');
        this.canCreate = Common.checkPermissions('Maestros-Vehiculos', 'Crear');
        this.canEdit = Common.checkPermissions('Maestros-Vehiculos', 'Editar');
        this.getGridDataVehicles(); 
        break;
      default:
        break;
    }
    this.cols = [
        { field: 'docName', header: 'Documento' },
        { field: 'maturityDate', header: 'Fecha' },
        { field: 'state', header: 'Estado' }
    ];
  
    this.formTransporterDoc = this.formBuilder.group({
      docSelected: ['',[Validators.required]],
      maturityDateSelected: ['']
     });

 }

 openNewTransporterDoc()
 {
   this.getAllDocs();
   this.transporterDocDialog = true;
   this.showVarCode = false;
   this.action = "Cargar";
   this.submittedTransporterDoc = false;
   this.formTransporterDoc.reset();
   this.showMatutityDate = false; 
 }

 getGridDataTransporters(){
  this.transporterService.getTransporterDocs(this.transporterId)
  .subscribe({
      next: (data:any) => {
        this.transporterDocs = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.detail, life: 5000 });
      }
  });
}

getGridDataDrivers(){
  this.driverService.getDriverDocs(this.transporterId)
  .subscribe({
      next: (data:any) => {
        this.transporterDocs = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.detail, life: 5000 });
      }
  });
}

getGridDataVehicles(){
  this.vehicleService.getVehicleDocs(this.transporterId)
  .subscribe({
      next: (data:any) => {
        this.transporterDocs = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.detail, life: 5000 });
      }
  });
}

getAllDocs(){
  this.parameterService.getParamByType('Documento')
  .subscribe({
      next: (data:any) => {
        this.Docs = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.detail, life: 5000 });
      }
  });
}

downloadDoc(urlDoc:string, docName: string)
{
  this.driverService.getDownloadDoc(urlDoc)
    .then((data) =>{
    FileSaver.saveAs(data as Blob,docName);
  }).catch((error) => {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.detail, life: 5000 });
  }); 
}

saveContentDialog()
  {
    switch (this.feature.toLowerCase()) {
      case 'conductor':
        this.saveDriverDocs()
        break;
      case 'transportador':
        this.saveTransporterDocs(); 
        break;
      case 'vehículo':
        this.saveVehicleDocs();
        break;
      default:
        break;
    }
  }

 saveTransporterDocs()
 {
  this.submittedTransporterDoc = true;
  if (this.formTransporterDoc.invalid) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
    return;
  }
    let formValues  = this.f;
    let objTransporterDoc: TransporterDocuments = {
      transporterId: this.transporterId,
      docId: formValues.docSelected.value,
      state: 'Pendiente'
    }
    this.transporterService.postTransporterDoc(objTransporterDoc)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.showMatutityDate = false;
                      this.showVarCode = true;
                      this.action = "Cargar";
                      this.getGridDataTransporters();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Documento del Transportador Creado', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });


 }

 changeDoc(event: any)
 {
  this.docName = this.Docs.find(x=> x.id === event.value)?.name as string;
  if(this.feature.toLowerCase() === 'conductor' || this.feature.toLowerCase() === 'vehículo'){
    this.showMatutityDate = this.Docs.find(x=> x.id === event.value)?.expire as boolean;
    if(this.showMatutityDate)
    {
      this.formTransporterDoc.get("maturityDateSelected")?.setValidators(Validators.required);
    }else
    {
      this.formTransporterDoc.get("maturityDateSelected")?.removeValidators(Validators.required);
    }
    this.formTransporterDoc.get("maturityDateSelected")?.updateValueAndValidity();
  }
 }

 saveDriverDocs()
 {
  this.submittedTransporterDoc = true;
  if (this.formTransporterDoc.invalid) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
    return;
  }
    let formValues  = this.f;
    let objDriverDoc: DriverDocument = {
      driverId: this.transporterId,
      docId: formValues.docSelected.value,
      state: 'Pendiente',
      maturityDate: this.showMatutityDate ? formValues.maturityDateSelected.value : new Date()
    }
    this.driverService.postDriverDoc(objDriverDoc)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.showVarCode = true;
                      this.action = "Cargar";
                      this.getGridDataDrivers();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Documento del Conductor Creado', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                    console.log(error);
                  }
              });


 }

 saveVehicleDocs()
 {
  this.submittedTransporterDoc = true;
  if (this.formTransporterDoc.invalid) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
    return;
  }
    let formValues  = this.f;
    let objvehicleDoc: VehicleDocuments = {
      vehicleId: this.transporterId,
      docId: formValues.docSelected.value,
      state: 'Pendiente'
    }
    this.vehicleService.postVehicleDoc(objvehicleDoc)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.showMatutityDate = false;
                      this.showVarCode = true;
                      this.action = "Cargar";
                      this.getGridDataVehicles();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Documento del vehículo Creado', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });


 }


 uploadFiles(event: any)
 {

  const formData: FormData = new FormData();
  event.files.forEach((element: any) => {
          formData.append('', element);
  });
  formData.append('NumeroDocumento', this.transporterDoc);

switch (this.feature.toLowerCase()) {
  case 'conductor':
    this.UploadFileDriver(formData);
    break;
  case 'transportador':
    this.UploadFileTransporter(formData);
    break;
  case 'vehículo':
    this.UploadFileVehicle(formData);
    break;
  default:
    break;
}
}

 UploadFileTransporter(formData: FormData)
 {
  this.transporterService.postUploadTransporterDoc(formData)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.putTransporterDocs(data);
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });

 }

 UploadFileDriver(formData: FormData)
 {
  this.driverService.postUploadDriverDoc(formData)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.putDriverDocs(data);
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });

 }

 UploadFileVehicle(formData: FormData)
 {
  this.vehicleService.postUploadVehicleDoc(formData)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.putVehicleDocs(data);
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });

 }


 putTransporterDocs(urlDoc: string)
 {
  let formValues  = this.f;
    let objTransporterDoc: TransporterDocuments = {
      transporterId: this.transporterId,
      docId: formValues.docSelected.value,
      docUrl:urlDoc
    }
  this.transporterService.putTransporterDoc(objTransporterDoc)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.transporterDocDialog = false;
                      this.getGridDataTransporters();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Documento del Transportador Actualizado', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });
 }

 putDriverDocs(urlDoc: string)
 {
  let formValues  = this.f;
    let objTransporterDoc: DriverDocument = {
      driverId: this.transporterId,
      docId: formValues.docSelected.value,
      docUrl:urlDoc,
      state: 'Cargado',
      maturityDate: formValues.maturityDateSelected.value
    }
  this.driverService.putDriverDoc(objTransporterDoc)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.transporterDocDialog = false;
                      this.getGridDataDrivers();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Documento del Conductor Actualizado', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });
 }

 putVehicleDocs(urlDoc: string)
 {
  let formValues  = this.f;
    let objVehicleDoc: VehicleDocuments = {
      vehicleId: this.transporterId,
      docId: formValues.docSelected.value,
      docUrl:urlDoc
    }
  this.vehicleService.putVehicleDoc(objVehicleDoc)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.transporterDocDialog = false;
                      this.getGridDataVehicles();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Documento del Vehículo Actualizado', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                  }
              });
 }



 loadDoc(docName: string, docId: number, matuDate: string){
  this.transporterDocDialog = true;
  this.showVarCode = true;
  this.action = "Cargar";
  this.docName = docName;
  this.formTransporterDoc.reset();
  this.formTransporterDoc.get('docSelected')?.setValue(docId);
  if(this.feature.toLowerCase() === 'conductor'){
    this.showMatutityDate = false;
    this.formTransporterDoc.get('maturityDateSelected')?.setValue(matuDate);
  }
 }

 get f() { return this.formTransporterDoc?.controls; }
}
