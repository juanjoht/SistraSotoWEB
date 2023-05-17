import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Common } from 'src/app/common/common';
import { material } from 'src/app/ui/models/material.model';
import { ProviderTimes } from 'src/app/ui/models/provider.model';
import { MaterialService } from 'src/app/ui/service/material.service';
import { ProviderService } from 'src/app/ui/service/provider.service';

@Component({
  selector: 'app-provider-times',
  templateUrl: './provider-times.component.html',
  styleUrls: ['./provider-times.component.scss']
})
export class ProviderTimesComponent implements OnInit {
  @Input() providerName: string = '';
  @Input() providerId: number = 0;
  @Input() viewMode: boolean = false;
  formproviderTime!: FormGroup;
  providerTimes: ProviderTimes[] = [];
  providerTime: ProviderTimes = {};
  materials: material[] = [];
  submittedproviderTimes: boolean = false;
  providerTimeDialog: boolean = false;
  editMode: boolean = false;
  providerTimeId: number = 0;
  cols: any[] = [];
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  constructor(
    private materialService: MaterialService,
    private providerService: ProviderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

    ngOnInit() {
      this.getGridData();
      this.getMaterials();
      this.cols = [
        { field: 'material', header: 'Material' },
        { field: 'simple', header: 'Sencillo min' },
        { field: 'double', header: 'Doble min' },
        { field: 'tractor', header: 'Tractomula min' },
        { field: 'state', header: 'Estado' }
    ];
      this.formproviderTime = this.formBuilder.group({
        materialSelected: ['',[Validators.required]],
        simple: [0,[Validators.required]],
        double: [0,[Validators.required]],
        tractor: [0,[Validators.required]],
        stateSelected: [false]
       });
       this.canRead = Common.checkPermissions('Terceros-Proveedores', 'Consultar');
       this.canCreate = Common.checkPermissions('Terceros-Proveedores', 'Crear');
       this.canEdit = Common.checkPermissions('Terceros-Proveedores', 'Editar');
   }

   getGridData(){
    this.providerService.getProviderTimes(this.providerId)
    .subscribe({
        next: (data:any) => {
          this.providerTimes = data;
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

  openNewTime()
  {
    this.providerTimeDialog = true;
    this.submittedproviderTimes = false;
    this.editMode= false;
    this.formproviderTime.reset();
  }
  

  editproviderTime(providerTime: ProviderTimes) {
    this.providerTimeDialog = true;
    this.editMode = true;
    this.providerTime  = providerTime;
    this.providerTimeId = providerTime.id as number;
    this.formproviderTime = this.formBuilder.group({
      materialSelected: [this.providerTime.material,[Validators.required]],
      simple: [this.providerTime.simple, [Validators.required]],
      double: [this.providerTime.double, [Validators.required]],
      tractor: [this.providerTime.tractor, [Validators.required]],
      stateSelected:[this.providerTime.state === 'Activo' ? true: false]
     });
  }

  saveTimes()
  {
   this.submittedproviderTimes = true;
   if (this.formproviderTime.invalid) {
     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
     return;
   }
     let formValues  = this.f;
     let objproviderTime: ProviderTimes = {
       providerId: this.providerId,
       material: formValues.materialSelected.value,
       simple: formValues.simple.value,
       double: formValues.double.value,
       tractor: formValues.tractor.value,
       state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
     }
     if (this.editMode){
      objproviderTime.id = this.providerTimeId;
      this.providerService.putProviderTime(objproviderTime)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.getGridData();
              this.providerTimeDialog = false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tiempos de Cargue Actualizados', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }else{
     this.providerService.postProviderTime(objproviderTime)
               .subscribe({
                   next: (data) => {
                     if(data !== null)
                     {
                       this.getGridData();
                       this.providerTimeDialog = false;
                       this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tiempos de Cargue Creados', life: 3000 });
                     }
                   },
                   error: error => {
                     this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                   }
               });
              }
  }


  get f() { return this.formproviderTime?.controls; }
}
