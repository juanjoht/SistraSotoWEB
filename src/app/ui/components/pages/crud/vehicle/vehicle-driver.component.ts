import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DriverGeneralInfo } from 'src/app/ui/models/driver.model';
import { Driver } from 'src/app/ui/models/vehicles.model';
import { DriverService } from 'src/app/ui/service/driver.service';
import { VehicleService } from 'src/app/ui/service/vehicle.service';

@Component({
  selector: 'app-vehicle-driver',
  templateUrl: './vehicle-driver.component.html',
  styleUrls: ['./vehicle-driver.component.scss']
})
export class VehicleDriverComponent implements OnInit {
  @Input() vehicleName: string = '';
  @Input() vehicleId: number = 0;
  @Input() viewMode: boolean = false;
  formDriver!: FormGroup;
  vehicleDrivers: Driver[] = [];
  vehicleDriver: Driver = {};
  allDrivers: DriverGeneralInfo[] = [];
  submittedDriver: boolean = false;
  driverDialog: boolean = false;
  editMode: boolean = false;
  driverId: number = 0;
  cols: any[] = [];
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  constructor(
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

    ngOnInit() {
      this.getGridData();
      this.getAllDrivers();
      this.cols = [
        { field: 'name', header: 'Conductor' },
        { field: 'state', header: 'Estado' }
    ];
      this.formDriver = this.formBuilder.group({
        driverSelected: ['',[Validators.required]],
        stateSelected: [true]
       });
       //this.canRead = Common.checkPermissions('Terceros-Proveedores', 'Consultar');
       //this.canCreate = Common.checkPermissions('Terceros-Proveedores', 'Crear');
       //this.canEdit = Common.checkPermissions('Terceros-Proveedores', 'Editar');
   }

   getGridData(){
    this.vehicleService.getVehicleDriver(this.vehicleId)
    .subscribe({
        next: (data:any) => {
          this.vehicleDrivers = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  getAllDrivers(){
    this.driverService.getDrivers()
    .subscribe({
        next: (data:any) => {
          this.allDrivers = data;
        },
        error: (error: { message: any; }) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  openNew()
  {
    this.driverDialog = true;
    this.editMode= false;
    this.submittedDriver = false;
    this.formDriver.reset();
    this.f?.stateSelected.setValue(true);
  }
  

  edit(driverModel:Driver ) {
    this.driverDialog = true;
    this.editMode = true;
    this.vehicleDriver = driverModel;
    this.driverId = driverModel.id as number;
    this.formDriver = this.formBuilder.group({
      driverSelected: [driverModel.id,[Validators.required]],
      stateSelected:[driverModel.state === 'Activo' ? true: false]
     });
  }

  save()
  {
   this.submittedDriver = true;
   if (this.formDriver.invalid) {
     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
     return;
   }
     let formValues  = this.f;
     let objDriver: Driver = {
       vehicleId: this.vehicleId,
       id: this.f?.driverSelected.value,
       state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
     }
      this.vehicleService.getDriverRelated(objDriver.vehicleId, objDriver.id)
      .subscribe({
          next: (data) => {
            if(data)
            {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El conductor ya esta relacionado con el vehículo', life: 3000 });
            }else
            {
              this.postVehicleDriver(objDriver);
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
  }

  postVehicleDriver(objDriver:Driver)
  {
    this.vehicleService.postVehicleDriver(objDriver)
               .subscribe({
                   next: (data) => {
                     if(data !== null)
                     {
                       this.getGridData();
                       this.driverDialog = false;
                       this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Conductor Creado', life: 3000 });
                     }
                   },
                   error: error => {
                     this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                   }
               });
  }

  get f() { return this.formDriver?.controls; }
}
