import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Common } from 'src/app/common/common';
import { params } from 'src/app/ui/models/param.model';
import { ParamService } from 'src/app/ui/service/param.service';
import { ParametersEditComponent } from './parameters-edit.component';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
  providers: [MessageService]
})
export class ParametersComponent implements OnInit {
  @ViewChild(ParametersEditComponent)editBasic!: ParametersEditComponent;
  params: params[] = [];
  paramBasic : params = {};
  cols: any[] = [];
  paramDialog: boolean = false;
  showOptions: boolean = true;
  editMode: boolean = false;
  paramId: number= 0;  
  paramName: string = '';
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;

  constructor(
    private messageService: MessageService,
     private paramService:ParamService
     ) { }

     checkPermissions(itemMenu: string, action: string) {
      let modules = Common.Modules;
      let moduleSearch = `${itemMenu}-${action}`;
      let module = modules.find(x => x.modulo === moduleSearch);
    
      switch (action.toLocaleLowerCase()) {
        case 'consultar':
            this.canRead = module.permiso;
          break;
         case 'crear':
            this.canCreate = module.permiso;
         break; 
         case 'editar':
            this.canEdit = module.permiso;
         break; 
        default:
          break;
      }
    }

    ngOnInit(): void {
      this.getGridData();
      this.cols = [
        { field: 'type', header: 'Tipo' },
        { field: 'name', header: 'Descripción' },
        { field: 'value1', header: 'Valor 1' },
        { field: 'value2', header: 'Valor 2' }
      ];
      this.checkPermissions('Seguridad-Parametros', 'Consultar');
      this.checkPermissions('Seguridad-Parametros', 'Crear');
      this.checkPermissions('Seguridad-Parametros', 'Editar');
    }

    getGridData(){
      this.paramService.getParams()
      .subscribe({
          next: (data:any) => {
            this.params = data;
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }

    openNew() {
      this.paramDialog = true;
      this.paramBasic = {};
      this.editMode= false;
      this.showOptions = true;
    }

    saveContent(){
      this.editBasic.submittedBasic = true;
      if (this.editBasic.formGroupBasic.invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
        return;
      }
      let formValues  = this.editBasic.f;
      let objBasic: params = {
        type: formValues.typeSelected.value,
        name: formValues.desc.value,
        value1: formValues.value1.value,
        value2: formValues.value2.value,
        expire: formValues.expireSelected.value,
        state: (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
        }
        if (this.editMode){
          objBasic.id = this.paramId;
          this.paramService.putBasic(objBasic)
          .subscribe({
              next: (data) => {
                if(data !== null)
                {
                  this.paramDialog = false;
                  this.getGridData();
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario Actualizado', life: 3000 });
                }
              },
              error: error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
              }
          });
        }else{
          this.paramService.postBasic(objBasic)
          .subscribe({
              next: (data) => {
                if(data !== null)
                {
                  this.paramDialog = false;
                  this.getGridData();
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000 });
                }
              },
              error: error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
              }
          });
        }
    }
  hideDialog()
  {
    this.paramDialog = false;
    this.editBasic.submittedBasic = false;
  }

  editParam(paramBasic: any, viewmode: any = false) {
    this.paramDialog = true;
    this.paramBasic  = paramBasic;
    this.editMode = true;
    this.paramId = this.paramBasic.id as number;
    this.showOptions = !viewmode;
  }
}
