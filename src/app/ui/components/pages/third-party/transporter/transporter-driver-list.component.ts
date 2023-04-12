import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DriverInfo } from 'src/app/ui/models/driver.model';
import { TransporterDriver } from 'src/app/ui/models/transporter.model';
import { DriverService } from 'src/app/ui/service/driver.service';
import { TransporterService } from 'src/app/ui/service/transporter.service';

@Component({
  selector: 'app-transporter-driver-list',
  templateUrl: './transporter-driver-list.component.html',
  styleUrls: ['./transporter-driver-list.component.scss']
})
export class TransporterDriverListComponent implements OnInit {
  @Input() transporterName: string = '';
  @Input() transporterId: number = 0;
  @Input() viewMode: boolean = false;
  formTransporterDriver!: FormGroup;
  transporterDrivers: TransporterDriver[] = [];
  Drivers: DriverInfo[] = [];
  submittedTransporterDriver: boolean = false;
  validateTransporterDriver: boolean = false;
  transporterDriverDialog: boolean = false;
  deleteTransporterDriverDialog: boolean = false;
  isRelatedTransporterDriverDialog: boolean = false;
  cols: any[] = [];
  constructor(
    private DriverService: DriverService,
    private transporterService: TransporterService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.getGridData();

    this.cols = [
        { field: 'docNumber', header: 'Número de Documento' },
        { field: 'name', header: 'Nombre' },
        { field: 'phone', header: 'Teléfono' },
        { field: 'state', header: 'Estado' }
    ];
  
    this.formTransporterDriver = this.formBuilder.group({
      DriverSelected: ['',[Validators.required]],
      DriverNameSelected: ['',[Validators.required]],
      verificationCode: ['']
     });

 }

 docNumberSelect(event: any)
  {
    this.formTransporterDriver.get('DriverNameSelected')?.setValue(event.value)
  }

  docNameSelect(event: any)
  {
    this.formTransporterDriver.get('DriverSelected')?.setValue(event.value)
  }

 openNewDriver()
 {
  this.getAllDrivers();
  this.transporterDriverDialog = true;
  this.formTransporterDriver.reset();
 }

 getGridData(){
  this.transporterService.getTransporterDrivers(this.transporterId)
  .subscribe({
      next: (data:any) => {
        this.transporterDrivers = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
      }
  });
}

getAllDrivers(){
  this.DriverService.getDrivers()
  .subscribe({
      next: (data:any) => {
        this.Drivers = data;
      },
      error: (error: { message: any; }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
      }
  });
}

checkIfisRelatedToAnother(objTransDriver: TransporterDriver)
{
  let existRelationship: Boolean = false;
  this.DriverService.getDriverIsRelated(objTransDriver.driverId as number,objTransDriver.transporterId as number)
  .subscribe({
      next: (data) => {
        if(data !== null)
        {
          if(data.isRelated)
          {
            this.isRelatedTransporterDriverDialog = true;
            existRelationship = true;
          }else
          {
            this.linkTransporterDriver(objTransDriver);
          }
        }
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        console.log(error);
      }
  });
 return existRelationship;
}

confirmBreakRelationship()
{
  let formValues  = this.f;
  let objTransporterDriver: TransporterDriver = {
    transporterId: this.transporterId,
    driverId: formValues.DriverSelected.value
  }
  this.linkTransporterDriver(objTransporterDriver);
}

 saveTransporterDriver()
 {
  this.submittedTransporterDriver = true;
  if (this.formTransporterDriver.invalid) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
    return;
  }
    let formValues  = this.f;
    let objTransporterDriver: TransporterDriver = {
      transporterId: this.transporterId,
      driverId: formValues.DriverSelected.value
    }
    this.checkIfisRelatedToAnother(objTransporterDriver);
 }

 linkTransporterDriver(objTransDriver: TransporterDriver)
 {
  this.transporterService.postLinkTransporterDriver(objTransDriver)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Conductor Relacionado', life: 3000 });
                      this.getGridData();
                      this.isRelatedTransporterDriverDialog = false;
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                    console.log(error);
                  }
              });
 }



 deleteTransporterDriver ()
 {
  this.deleteTransporterDriverDialog = true;
 }

 confirmDeleteSelected()
 {
  
 }

 get f() { return this.formTransporterDriver?.controls; }
}
