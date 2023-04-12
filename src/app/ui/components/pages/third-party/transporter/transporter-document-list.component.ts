import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DriverDocument } from 'src/app/ui/models/driver.model';
import { params } from 'src/app/ui/models/param.model';
import { TransporterDocuments } from 'src/app/ui/models/transporter.model';
import { DriverService } from 'src/app/ui/service/driver.service';
import { ParamService } from 'src/app/ui/service/param.service';
import { TransporterService } from 'src/app/ui/service/transporter.service';

@Component({
  selector: 'app-transporter-document-list',
  templateUrl: './transporter-document-list.component.html',
  styleUrls: ['./transporter-document-list.component.scss']
})
export class TransporterDocumentListComponent implements OnInit {
  @Input() feature: string = '';
  @Input() transporterName: string = '';
  @Input() transporterId: number = 0;
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
  constructor(
    private parameterService: ParamService,
    private transporterService: TransporterService,
    private driverService: DriverService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    if(this.feature.toLowerCase() === 'conductor'){
      this.getGridDataDrivers();
    }
    else if (this.feature.toLowerCase() === 'transportador')
    {
       this.getGridDataTransporters(); 
    }
    

    this.cols = [
        { field: 'docName', header: 'Documento' },
        { field: 'maturityDate', header: 'Fecha' },
        { field: 'state', header: 'Estado' }
    ];
  
    this.formTransporterDoc = this.formBuilder.group({
      docSelected: ['',[Validators.required]],
      file: ['']
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
 }

 getGridDataTransporters(){
  this.transporterService.getTransporterDocs(this.transporterId)
  .subscribe({
      next: (data:any) => {
        this.transporterDocs = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.details, life: 5000 });
        console.log(error);
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        console.log(error);
      }
  });
}

getAllDocs(){
  this.parameterService.getParamByType('Documento')
  .subscribe({
      next: (data:any) => {
        this.Docs = data;
      },
      error: (error: { message: any; }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        console.log(error);
      }
  });
}

saveContentDialog()
  {
    if(this.feature.toLowerCase() === 'conductor'){
      this.saveDriverDocs()
    }
    else if (this.feature.toLowerCase() === 'transportador')
    {
       this.saveTransporterDocs(); 
    }
  }

 saveTransporterDocs()
 {
  this.submittedTransporterDoc = true;
  if (this.formTransporterDoc.invalid) {
    return;
  }
    let formValues  = this.f;
    let objTransporterDoc: TransporterDocuments = {
      transporterId: this.transporterId,
      docId: formValues.docSelected.value
    }
    this.transporterService.postTransporterDoc(objTransporterDoc)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.showVarCode = true;
                      this.action = "Cargar";
                      this.getGridDataTransporters();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Documento del Transportador Creado', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                    console.log(error);
                  }
              });


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
      docId: formValues.docSelected.value
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

 LoadDoc()
 {

 }

 get f() { return this.formTransporterDoc?.controls; }
}
