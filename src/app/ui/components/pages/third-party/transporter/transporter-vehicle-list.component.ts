import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TransporterVehicles } from 'src/app/ui/models/transporter.model';
import { Vehicle } from 'src/app/ui/models/vehicles.model';
import { TransporterService } from 'src/app/ui/service/transporter.service';
import { VehicleService } from 'src/app/ui/service/vehicle.service';

@Component({
  selector: 'app-transporter-vehicle-list',
  templateUrl: './transporter-vehicle-list.component.html',
  styleUrls: ['./transporter-vehicle-list.component.scss']
})
export class TransporterVehicleListComponent implements OnInit {
  @Input() transporterName: string = '';
  @Input() transporterId: number = 0;
  @Input() viewMode: boolean = false;
  formTransporterVehicle!: FormGroup;
  transporterVehicles: TransporterVehicles[] = [];
  vehicles: Vehicle[] = [];
  submittedTransporterVehicle: boolean = false;
  validateTransporterVehicle: boolean = false;
  transporterVehicleDialog: boolean = false;
  deleteTransporterVehicleDialog: boolean = false;
  showVarCode = false;
  cols: any[] = [];
  action: string = "Relacionar";
  vehicleId: number = 0;
  constructor(
    private vehicleService: VehicleService,
    private transporterService: TransporterService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.getGridData();

    this.cols = [
        { field: 'licensePlate', header: 'Placa' },
        { field: 'type', header: 'Tipo' },
        { field: 'capacityTon', header: 'Capacidad ton' },
        { field: 'capacityM3', header: 'Capacidad m3' },
        { field: 'state', header: 'Estado' }
    ];
  
    this.formTransporterVehicle = this.formBuilder.group({
      vehicleSelected: ['',[Validators.required]],
      verificationCode: ['']
     });

 }

 openNewVehicle()
 {
  this.getAllVehicles();
   this.transporterVehicleDialog = true;
   this.showVarCode = false;
   this.action = "Relacionar";
   this.submittedTransporterVehicle = false;
   this.formTransporterVehicle.reset();
   this.formTransporterVehicle.get("verificationCode")?.removeValidators(Validators.required);
   this.formTransporterVehicle.updateValueAndValidity();
 }

 getGridData(){
  this.transporterService.getTransporterVehicles(this.transporterId)
  .subscribe({
      next: (data:any) => {
        this.transporterVehicles = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
      }
  });
}

getAllVehicles(){
  this.vehicleService.getVehicle()
  .subscribe({
      next: (data:any) => {
        this.vehicles = data;
      },
      error: (error: { message: any; }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
      }
  });
}

 saveTransporterVehicle()
 {
  this.submittedTransporterVehicle = true;
  if (this.formTransporterVehicle.invalid) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
    return;
  }
    let formValues  = this.f;
    let objTransporterVehicle: TransporterVehicles = {
      transporterId: this.transporterId,
      vehicleId: formValues.vehicleSelected.value
    }
    this.transporterService.postLinkTransporterVehicle(objTransporterVehicle)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.getGridData();
                      this.showVarCode = true;
                      this.action = "Autorizar";
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Vehículo del Transportador Creado', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                  }
              });
 }

 validateVehicle()
 {
    this.f["verificationCode"].setValidators(Validators.required);
    this.formTransporterVehicle.get("verificationCode")?.updateValueAndValidity();
    if(!this.formTransporterVehicle.invalid)
    {
      this.authorizeVehicle();
    }
 }

 authorizeVehicle()
 {
    let formValues  = this.f;
    let objTransporterVehicle: TransporterVehicles = {
      transporterId: this.transporterId,
      vehicleId: formValues.vehicleSelected.value,
      AuthCode : formValues.verificationCode.value
    }
    
    this.transporterService.postAuthorizeVehile(objTransporterVehicle)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      if(data)
                      {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Vehículo Autorizado', life: 3000 });
                        this.transporterVehicleDialog = false; 
                        this.getGridData();
                      }else
                      {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo autorizar el Vehículo, verifique que el código sea el correcto', life: 3000 });
                      }
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                    console.log(error);
                  }
              });
 }

 deleteTransporterVehicle (vehicleid: number)
 {
  this.deleteTransporterVehicleDialog = true;
  this.vehicleId = vehicleid;
 }

 confirmDeleteSelected()
 {

  this.transporterService.deleteTransporterVehicle(this.transporterId,this.vehicleId)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      if(data)
                      {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Vehículo Eliminado', life: 3000 });
                        this.deleteTransporterVehicleDialog = false; 
                        this.getGridData();
                      }else
                      {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Vehículo', life: 3000 });
                      }
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                    console.log(error);
                  }
              });
  
 }

 showAuthWin(idVehicle: number)
 {
  this.transporterVehicleDialog = true;
  this.formTransporterVehicle.reset();
  this.formTransporterVehicle.get("vehicleSelected")?.setValue(idVehicle);
  this.validateTransporterVehicle = true;
  this.showVarCode = true;
  this.action = "Autorizar";
 }

 sendCodeAgain(idVehicle: number)
 {
  this.formTransporterVehicle.reset();
  this.submittedTransporterVehicle = false;
  this.formTransporterVehicle.get("vehicleSelected")?.setValue(idVehicle);
    let objTransporterVehicles: TransporterVehicles = {
      transporterId: this.transporterId,
      vehicleId: idVehicle
    }
    this.transporterService.sendVehicleCode(objTransporterVehicles)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      if(data)
                      {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Código de Validación Enviado', life: 3000 });
                        this.transporterVehicleDialog = true;
                        this.showVarCode = true;
                        this.action = "Autorizar";
                      }else
                      {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar código de validación al transportador', life: 3000 });
                      }
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                  }
              });
 }

 get f() { return this.formTransporterVehicle?.controls; }
}
