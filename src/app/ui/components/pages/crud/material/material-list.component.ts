import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MaterialEditComponent } from './material-edit.component';
import { material } from 'src/app/ui/models/material.model';
import { MaterialService } from 'src/app/ui/service/material.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
  providers: [MessageService]
})
export class MaterialListComponent implements OnInit {
  @ViewChild(MaterialEditComponent)editBasic!: MaterialEditComponent;
  materials: material[] = [];
  material : material = {};
  cols: any[] = [];
  materialEditTab: boolean = true;
  materialDialog = false;
  showOptions: boolean = true;
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  tabIndex: number = 0;
  editMode: boolean = false;
  isViewMode: boolean = false;
  materialId: number= 0;
  materialName: string  = '';

  constructor(private materialService: MaterialService, private messageService: MessageService) { }

  ngOnInit() {
    this.getGridData();

    this.cols = [
        { field: 'name', header: 'Placa' },
        { field: 'unitMass', header: 'Masa Unitaria' },
        { field: 'valueM3', header: 'Precio Venta m3' },
        { field: 'valueTon', header: 'Precio Venta ton' },
        { field: 'valueMinM3', header: 'Valor Min m3' },
        { field: 'valueMaxM3', header: 'Valor Max m3' },
        { field: 'valueMinTon', header: 'Valor Min ton' },
        { field: 'valueMaxTon', header: 'Valor Max ton' },
        { field: 'state', header: 'Estado' }
    ];
  }

  getGridData(){
    this.materialService.getMaterial()
    .subscribe({
        next: (data:any) => {
          this.materials = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  openNew(){
    this.materialDialog = true;
    this.editMode= false;
    this.material = {};
    this.showOptions = true;
  }

  editMaterial(vehicleBasic: any, isviewMode: boolean = false) {
    this.editMode= true;
    this.materialId = vehicleBasic.id as number;
    this.materialName = vehicleBasic.name;
    this.materialDialog = true;
    this.material = vehicleBasic;
    this.isViewMode = isviewMode;
    this.showOptions = !isviewMode;
  }


  saveMaterial(){
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGroupBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBasic.f;
    let objBasic: material = {
      name: formValues.material.value,
      unitMass: formValues.unitMass.value,
      valueM3: formValues.valuem3.value,
      valueTon: formValues.valueton.value,
      valueMinM3: formValues.valueMinm3.value,
      valueMaxM3: formValues.valueMaxm3.value,
      valueMinTon: formValues.valueMinTon.value,
      valueMaxTon: formValues.valueMaxton.value,
      state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
    }
    if (this.editMode){
      objBasic.id = this.materialId;
      this.materialService.putMaterial(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.materialDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Material Actualizado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }else{
      this.materialService.postMaterial(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.materialDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Material Creado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }
  }

  hideDialog(){
    this.materialDialog = false;
    this.editBasic.submittedBasic = false;
  }
}
