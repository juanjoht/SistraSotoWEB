import { Component, OnInit, ViewChild } from '@angular/core';
import { UserProfileEditComponent } from './user-profile-edit.component';
import { Profile } from 'src/app/ui/models/profile.model';
import { MessageService } from 'primeng/api';
import { ProfileService } from 'src/app/ui/service/profile.service';
import { Common } from 'src/app/common/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [MessageService]
})
export class UserProfileComponent implements OnInit {
  @ViewChild(UserProfileEditComponent)editBasic!: UserProfileEditComponent;
  profiles: Profile[] = [];
  profileBasic : Profile = {};
  cols: any[] = [];
  profileDialog: boolean = false;
  showOptions: boolean = true;
  editMode: boolean = false;
  isViewMode: boolean = false;
  profileId: number= 0;  
  deleteProfileDialog :boolean =  false;
  moduleDialog: boolean = false;
  profileName: string = '';
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  canAsingPermissions: boolean = true;
  canDelete: boolean = true;

  constructor(
    private messageService: MessageService,
     private profileService:ProfileService
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
         case 'asignarpermisos':
            this.canAsingPermissions = module.permiso;
         break;
         case 'eliminar':
            this.canDelete = module.permiso;
         break;

        default:
          break;
      }
    }

  ngOnInit(): void {
    this.getGridData();
    this.cols = [
      { field: 'name', header: 'Perfil' },
      { field: 'desc', header: 'Descripción' },
      { field: 'state', header: 'Estado' }
    ];
    this.checkPermissions('Seguridad-Perfiles', 'Consultar');
    this.checkPermissions('Seguridad-Perfiles', 'Crear');
    this.checkPermissions('Seguridad-Perfiles', 'Editar');
    this.checkPermissions('Seguridad-Perfiles', 'AsignarPermisos');
    this.checkPermissions('Seguridad-Perfiles', 'Eliminar');
  }

  getGridData(){
    this.profileService.getProfiles()
    .subscribe({
        next: (data:any) => {
          this.profiles = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
        }
    });
  }

  openNew() {
    this.profileDialog = true;
    this.profileBasic = {};
    this.editMode= false;
    this.showOptions = true;
  }

  hideDialog() {
    this.profileDialog = false;
    this.editBasic.submittedBasic = false;
  }

  editProfile(profileBasic: any, viewmode: any = false) {
    this.profileDialog = true;
    this.profileBasic  = profileBasic;
    this.editMode = true;
    this.profileId = this.profileBasic.id as number;
    this.isViewMode = viewmode;
    this.showOptions = !viewmode;
  }

  saveContent(){
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGroupBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBasic.f;
    let objBasic: Profile = {
      name: formValues.name.value,
      desc: formValues.desc.value,
      state: (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
      }
      if (this.editMode){
        objBasic.id = this.profileId;
        this.profileService.putBasic(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.profileDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Perfil Actualizado', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
      }else{
        this.profileService.postBasic(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.profileDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Perfil Creado', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
      }
  }
  
  setPermissions(profileName: string, id:number)
  {
    this.profileName = profileName;
    this.moduleDialog = true;
    this.profileId = id;
  }

  deleteProfile (id: number)
  {
   this.deleteProfileDialog = true;
   this.profileId = id;
  }
 
  confirmDeleteSelected()
  {
   this.profileService.deleteProfile(this.profileId)
       .subscribe({
           next: (data) => {
             if(data !== null)
             {
               this.deleteProfileDialog = false;
               this.getGridData();
               this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Perfil Eliminado', life: 3000 });
             }
           },
           error: error => {
             this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.message, life: 5000 });
           }
       });
  }

}
