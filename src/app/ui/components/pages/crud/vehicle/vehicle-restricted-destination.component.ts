import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Common } from 'src/app/common/common';
import { RestrictedDestination } from 'src/app/ui/models/route.model';
import { VehicleRestrictedDestination } from 'src/app/ui/models/vehicles.model';
import { VehicleService } from 'src/app/ui/service/vehicle.service';

@Component({
  selector: 'app-vehicle-restricted-destination',
  templateUrl: './vehicle-restricted-destination.component.html',
  styleUrls: ['./vehicle-restricted-destination.component.scss']
})
export class VehicleRestrictedDestinationComponent implements OnInit {
  @Input() vehicleName: string = '';
  @Input() vehicleId: number = 0;
  @Input() viewMode: boolean = false;
  formRestrictedDestination!: FormGroup;
  restrictedDestinationsVehicle: RestrictedDestination[] = [];
  restrictedDestinationVehicle: VehicleRestrictedDestination = {};
  allRestrictedDestinations: RestrictedDestination[] = [];
  submittedDestination: boolean = false;
  restrictedDestinationDialog: boolean = false;
  deleteDialog: boolean = false;
  editMode: boolean = false;
  destinationId: number = 0;
  cols: any[] = [];
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  constructor(
    private vehicleService: VehicleService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

    ngOnInit() {
      this.canRead = Common.checkPermissions('Maestros-Vehiculos', 'Consultar');
      this.canCreate = Common.checkPermissions('Maestros-Vehiculos', 'Crear');
      this.canEdit = Common.checkPermissions('Maestros-Vehiculos', 'Editar');
      this.getGridData();
      this.getAllRestrictedDestination();
      this.cols = [
        { field: 'name', header: 'Conductor' },
        { field: 'state', header: 'Estado' }
    ];
      this.formRestrictedDestination = this.formBuilder.group({
        destinationSelect: ['',[Validators.required]],
        stateSelected: [true]
       });
       //this.canRead = Common.checkPermissions('Terceros-Proveedores', 'Consultar');
       //this.canCreate = Common.checkPermissions('Terceros-Proveedores', 'Crear');
       //this.canEdit = Common.checkPermissions('Terceros-Proveedores', 'Editar');
   }

   getGridData(){
    this.vehicleService.getRestrictedDestinationVehicle(this.vehicleId)
    .subscribe({
        next: (data:any) => {
          this.restrictedDestinationsVehicle = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  getAllRestrictedDestination(){
    this.vehicleService.getRestrictedDestination()
    .subscribe({
        next: (data:any) => {
          this.allRestrictedDestinations = data;
        },
        error: (error: { message: any; }) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  openNew()
  {
    this.restrictedDestinationDialog = true;
    this.editMode= false;
    this.submittedDestination= false;
    this.formRestrictedDestination.reset();
    this.f?.stateSelected.setValue(true);
  }
  



  save()
  {
   this.submittedDestination = true;
   if (this.formRestrictedDestination.invalid) {
     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
     return;
   }
     let obj: VehicleRestrictedDestination = {
       vehicleId: this.vehicleId,
       restrictedDestinationId: this.f?.destinationSelect.value as number
     }
     this.vehicleService.postRestrictedDestinationVehicle(obj)
     .subscribe({
         next: (data) => {
           if(data !== null)
           {
             this.getGridData();
             this.restrictedDestinationDialog = false;
             this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Destino Restringo Creado', life: 3000 });
           }
         },
         error: error => {
           this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
         }
     });
  }

  delete (id: number)
  {
    this.destinationId = id;
    this.deleteDialog = true;
  }
 
  confirmDeleteSelected()
  {
   this.vehicleService.deleteRestrictedDestinationVehicle(this.destinationId, this.vehicleId)
       .subscribe({
           next: (data) => {
             if(data !== null)
             {
               this.deleteDialog = false;
               this.getGridData();
               this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Destino Restringido Eliminado', life: 3000 });
             }
           },
           error: error => {
             this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.message, life: 5000 });
           }
       });
  }

  get f() { return this.formRestrictedDestination?.controls; }
}
