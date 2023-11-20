import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Common } from 'src/app/common/common';
import { material } from 'src/app/ui/models/material.model';
import { ProviderFactories } from 'src/app/ui/models/provider.model';
import { MaterialService } from 'src/app/ui/service/material.service';
import { ProviderService } from 'src/app/ui/service/provider.service';
import { ProviderFactoriesEditComponent } from './provider-factories-edit.component';

@Component({
  selector: 'app-provider-factories',
  templateUrl: './provider-factories.component.html',
  styleUrls: ['./provider-factories.component.scss']
})
export class ProviderFactoriesComponent implements OnInit {
  @Input() providerName: string = '';
  @Input() providerId: number = 0;
  @Input() viewMode: boolean = false;
  @ViewChild(ProviderFactoriesEditComponent)editFactory!: ProviderFactoriesEditComponent;
  formProviderFactory!: FormGroup;
  providerFactories: ProviderFactories[] = [];
  providerFactory: ProviderFactories = {};
  submittedproviderfactories: boolean = false;
  providerFactoryDialog: boolean = false;
  editMode: boolean = false;
  providerFactoryId: number = 0;
  cols: any[] = [];
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  showOptions: boolean = true;
  viewModeDialog: boolean = false;
  constructor(
    private providerService: ProviderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

    ngOnInit() {
      this.getGridData();
      this.cols = [
        { field: 'name', header: 'Nombre' },
        { field: 'city', header: 'Municipio' },
        { field: 'address', header: 'Dirección' },
        { field: 'state', header: 'Estado' }
    ];
       this.canRead = Common.checkPermissions('Terceros-Proveedores', 'Consultar');
       this.canCreate = Common.checkPermissions('Terceros-Proveedores', 'Crear');
       this.canEdit = Common.checkPermissions('Terceros-Proveedores', 'Editar');
   }

   getGridData(){
    this.providerService.getProviderFactories(this.providerId)
    .subscribe({
        next: (data:any) => {
          this.providerFactories = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }


  openNewFactory()
  {
    this.providerFactoryDialog = true;
    this.submittedproviderfactories = false;
    this.editMode= false;
    this.viewModeDialog= false;
    this.providerFactory = {};
  }
  

  editProviderFactory(providerFac: ProviderFactories, isviewMode: boolean = false) {
    this.providerFactoryDialog = true;
    this.editMode = true;
    this.providerFactory  = providerFac;
    this.providerFactoryId = providerFac.id as number;
    this.showOptions = !isviewMode;
    this.viewModeDialog= isviewMode;

  }

  saveFactory()
  {
    this.editFactory.submittedProviderFactories = true;
    if (this.editFactory.formGroupProviderFactories.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editFactory.f;
    let formValuesArray  = this.editFactory.schedules;
    let recTimes : string = '';
    formValuesArray.forEach((element: any, index: number) => {
      recTimes += `${element.day}=recibe/${element.receive}-tiempo/${element.schedule};`
    });
    let objFactory: ProviderFactories = {
      providerId: this.providerId,          
      name: formValues.name.value,
      phone: formValues.phone.value,
      contactName: formValues.contactName.value,
      dept: formValues.deptSelected.value,
      city: formValues.citySelected.value,
      zone: formValues.zoneSelected.value,
      address: formValues.address.value,
      email: formValues.email.value,
      latitude: formValues.latitude.value,
      length: formValues.length.value,
      haveSoto13System: formValues.haveSoto13.value,
      enterDoc: formValues.enterDoc.value,
      workTimes: recTimes.slice(0, -1),
      state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
    }
    if (this.editMode){
      objFactory.id = this.providerFactoryId;
      this.providerService.putProviderFactory(objFactory)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.providerFactoryDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Plata del Proveedor Actualizada', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }else{
      this.providerService.postProviderFactory(objFactory)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.providerFactoryDialog = false;
                      this.getGridData();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Planta del Proveedor Creada', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                    console.log(error);
                  }
              });
      }
  }


  hideDialog()
  {
    this.providerFactoryDialog = false;
  }


  
}
