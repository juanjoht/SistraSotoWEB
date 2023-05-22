import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Vehicle } from 'src/app/ui/models/vehicles.model';
import { VehicleService } from 'src/app/ui/service/vehicle.service';
import { VehicleBasicEditComponent } from './vehicle-basic-edit.component';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  providers: [MessageService]
})
export class VehicleListComponent implements OnInit {
  @ViewChild(VehicleBasicEditComponent)editBasic!: VehicleBasicEditComponent;

  vehicles: Vehicle[] = [];
  vehicle : Vehicle = {};
  cols: any[] = [];
  allowedMaterialsTab: boolean = true;
  driverTab: boolean = true;
  docsTab: boolean = true;
  restrictedDestinationsTab: boolean = true;
  vehicleDialog = false;
  showOptions: boolean = true;
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  tabIndex: number = 0;
  editMode: boolean = false;
  isViewMode: boolean = false;
  vehicleId: number= 0;
  vehicleLicensePlate: string  = '';
  constructor(private vehicleService: VehicleService, private messageService: MessageService) { }

  ngOnInit() {
    this.getGridData();

    this.cols = [
        { field: 'licensePlate', header: 'Placa' },
        { field: 'transporter', header: 'Transportador' },
        { field: 'type', header: 'Tipo' },
        { field: 'capacityM3', header: 'Capacidad m3' },
        { field: 'capacityTon', header: 'Capacidad ton' },
        { field: 'state', header: 'Estado' }
    ];
  }

  getGridData(){
    this.vehicleService.getVehicle()
    .subscribe({
        next: (data:any) => {
          this.vehicles = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  openNew(){
    this.vehicleDialog = true;
    this.editMode= false;
  }

  editVehicle(vehicleBasic: any, isviewMode: boolean = false) {
    this.editMode= true;
    this.vehicleId = vehicleBasic.id as number;
    this.vehicleLicensePlate = vehicleBasic.vehicleLicensePlate;
    this.vehicleDialog = true;
    this.allowedMaterialsTab = false;
    this.driverTab = false;
    this.docsTab = false;
    this.restrictedDestinationsTab = false;
    this.vehicle = vehicleBasic;
    this.isViewMode = isviewMode;
  }

  reloadGridAfterSave(){}

  onChangeTab(event: any){
    this.tabIndex = event.index;
  }

  saveContentTabs(){
      if (this.tabIndex === 0) {
        this.saveVehicleBasic();
      }
  }

  saveVehicleBasic(){
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGroupBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBasic.f;
    let objBasic: Vehicle = {
      transporter: formValues.transporterSelected.value,
      licensePlate: formValues.licensePlate.value,
      model: formValues.model.value.toString(),
      color: formValues.color.value,
      chassisNumber: formValues.ChassisNumber.value,
      grossWeight: formValues.grossWeight.value,
      cubed: formValues.cubed.value,
      kilometerToInspection: formValues.kmToInspection.value,
      kilometerLastInspection: formValues.kmLastInspection.value,
      dateLastInspection: formValues.dateLastInspection.value,
      type: formValues.vehicleTypeSelected.value,
      capacityTon: formValues.capacityTon.value,
      capacityM3: formValues.capacityM3.value,
      state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
    }
    if (this.editMode){
      objBasic.id = this.vehicleId;
      this.vehicleService.putVehicleBasic(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.vehicleId = data.id;
              this.vehicleLicensePlate = data.nombre;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Vehículo Actualizado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }else{
      this.vehicleService.postVehicleBasic(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.vehicleId = data.id;
              this.vehicleLicensePlate = data.nombre;
              this.allowedMaterialsTab = false;
              this.driverTab = false;
              this.docsTab = false;
              this.restrictedDestinationsTab = false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Vehículo Creado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }
  }

  hideDialog(){
    this.vehicleDialog = false;
    this.editBasic.submittedBasic = false;
  }

}
