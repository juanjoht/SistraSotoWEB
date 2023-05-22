import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { material } from 'src/app/ui/models/material.model';
import { allowedMaterial } from 'src/app/ui/models/vehicles.model';
import { MaterialService } from 'src/app/ui/service/material.service';
import { VehicleService } from 'src/app/ui/service/vehicle.service';

@Component({
  selector: 'app-vehicle-material',
  templateUrl: './vehicle-material.component.html',
  styleUrls: ['./vehicle-material.component.scss']
})
export class VehicleMaterialComponent implements OnInit {
  @Input() vehicleName: string = '';
  @Input() vehicleId: number = 0;
  @Input() viewMode: boolean = false;
  formAllowedMaterial!: FormGroup;
  allowedMaterials: allowedMaterial[] = [];
  allowedMaterial: allowedMaterial = {};
  materials: material[] = [];
  submittedAllowedMaterial: boolean = false;
  allowedMaterialDialog: boolean = false;
  editMode: boolean = false;
  allowedMaterialId: number = 0;
  cols: any[] = [];
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  constructor(
    private materialService: MaterialService,
    private vehicleService: VehicleService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

    ngOnInit() {
      this.getGridData();
      this.getMaterials();
      this.cols = [
        { field: 'material', header: 'Material' },
        { field: 'state', header: 'Estado' }
    ];
      this.formAllowedMaterial = this.formBuilder.group({
        materialSelected: ['',[Validators.required]],
        stateSelected: [true]
       });
       //this.canRead = Common.checkPermissions('Terceros-Proveedores', 'Consultar');
       //this.canCreate = Common.checkPermissions('Terceros-Proveedores', 'Crear');
       //this.canEdit = Common.checkPermissions('Terceros-Proveedores', 'Editar');
   }

   getGridData(){
    this.vehicleService.getVehicleMaterial(this.vehicleId)
    .subscribe({
        next: (data:any) => {
          this.allowedMaterials = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
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

  openNew()
  {
    this.allowedMaterialDialog = true;
    this.editMode= false;
    this.submittedAllowedMaterial = false;
    this.formAllowedMaterial.reset();
  }
  

  edit(allowedMaterialModel: allowedMaterial) {
    this.allowedMaterialDialog = true;
    this.editMode = true;
    this.allowedMaterial  = allowedMaterialModel;
    this.allowedMaterialId = allowedMaterialModel.id as number;
    this.formAllowedMaterial = this.formBuilder.group({
      materialSelected: [allowedMaterialModel.materialId,[Validators.required]],
      stateSelected:[allowedMaterialModel.state === 'Activo' ? true: false]
     });
  }

  save()
  {
   this.submittedAllowedMaterial = true;
   if (this.formAllowedMaterial.invalid) {
     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
     return;
   }
     let formValues  = this.f;
     let objAllowedMaterial: allowedMaterial = {
       vehicleId: this.vehicleId,
       materialsId : [formValues.materialSelected.value as number],
       state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
     }
     if (this.editMode){
      objAllowedMaterial.id = this.allowedMaterialId;
      this.vehicleService.putVehicleMaterial(objAllowedMaterial)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.getGridData();
              this.allowedMaterialDialog = false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Materiales Permitidos Actualizados', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }else{
     this.vehicleService.postVehicleMaterial(objAllowedMaterial)
               .subscribe({
                   next: (data) => {
                     if(data !== null)
                     {
                       this.getGridData();
                       this.allowedMaterialDialog = false;
                       this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Materiales Permitidos Creados', life: 3000 });
                     }
                   },
                   error: error => {
                     this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                   }
               });
              }
  }


  get f() { return this.formAllowedMaterial?.controls; }
}