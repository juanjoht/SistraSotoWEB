import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Common } from 'src/app/common/common';
import { material } from 'src/app/ui/models/material.model';
import { ProviderFactories } from 'src/app/ui/models/provider.model';
import { MaterialService } from 'src/app/ui/service/material.service';
import { ProviderService } from 'src/app/ui/service/provider.service';

@Component({
  selector: 'app-provider-factories',
  templateUrl: './provider-factories.component.html',
  styleUrls: ['./provider-factories.component.scss']
})
export class ProviderFactoriesComponent implements OnInit {
  @Input() providerName: string = '';
  @Input() providerId: number = 0;
  @Input() viewMode: boolean = false;
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
    this.providerFactory = {};
  }
  

  editProviderFactory(providerFac: ProviderFactories, isviewMode: boolean = false) {
    this.providerFactoryDialog = true;
    this.editMode = true;
    this.providerFactory  = providerFac;
    this.providerFactoryId = providerFac.id as number;
    this.showOptions = !isviewMode;
  }

  saveFactory()
  {
  
  }

  hideDialog()
  {
    this.providerFactoryDialog = false;
  }


  
}
