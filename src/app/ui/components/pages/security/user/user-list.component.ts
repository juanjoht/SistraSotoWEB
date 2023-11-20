import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FilterMatchMode, FilterService, MessageService, SelectItem } from 'primeng/api';
import { UserService } from 'src/app/ui/service/user.service';
import { UserEditComponent } from './user-edit.component';
import { User, thirdParty } from 'src/app/ui/models/user.model';
import { Profile } from 'src/app/ui/models/profile.model';
import { ProfileService } from 'src/app/ui/service/profile.service';
import { Common } from 'src/app/common/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [MessageService]
})
export class UserListComponent implements OnInit {
  @ViewChild(UserEditComponent)editBasic!: UserEditComponent;

  users: User[] = [];
  userBasic : User = {};
  cols: any[] = [];
  userDialog: boolean = false;
  showOptions: boolean = true;
  editMode: boolean = false;
  isViewMode: boolean = false;
  disabledDocInfoEdit: boolean = false;
  userId: number= 0;
  thirdParties: thirdParty[] = [];
  profiles: Profile[] = [];
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  canReset: boolean = true;
  constructor(
    private messageService: MessageService,
     private userService: UserService,
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
         case 'enviarcontraseña':
            this.canReset = module.permiso;
         break;

        default:
          break;
      }
    }


  ngOnInit(): void {
    this.getThirdParties();
    this.getGridData();
    this.getProfiles();
    this.cols = [
        { field: 'userName', header: 'Usuario' },
        { field: 'thirdParty', header: 'Tercero' },
        { field: 'name', header: 'Nombre' },
        { field: 'profile', header: 'Perfil' },
        { field: 'state', header: 'Estado' }
    ];
    this.checkPermissions('Seguridad-Usuarios', 'Consultar');
    this.checkPermissions('Seguridad-Usuarios', 'Crear');
    this.checkPermissions('Seguridad-Usuarios', 'Editar');
    this.checkPermissions('Seguridad-Usuarios', 'EnviarContraseña');
  }

  getThirdParties(){
    this.userService.getAllThirdParties()
    .subscribe({
        next: (data:any) => {
          this.thirdParties = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
        }
    });
  }

  getProfiles(){
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

  getGridData(){
   this.userService.getUsers()
    .subscribe({
        next: (data:any) => {
          this.users = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
        }
    });
  }

  openNew() {
    this.userDialog = true;
    this.userBasic = {};
    this.editMode= false;
    this.showOptions = true;
    this.disabledDocInfoEdit = false;
  }

  hideDialog() {
    this.userDialog = false;
    this.editBasic.submittedBasic = false;
  }

  editUser(UserBasic: any, viewmode: any = false) {
    this.userDialog = true;
    this.userBasic  = UserBasic;
    this.editMode = true;
    this.disabledDocInfoEdit = true;
    this.userId = this.userBasic.userId as number;
    this.isViewMode = viewmode;
    this.showOptions = !viewmode;
  }

  resetPassword(userName : string){
    let newPassword = this.generatePassword();
    this.userService.resetPassword(userName,newPassword)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Contraseña Actualizada', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
  }

  saveContent(){
    console.log(this.userBasic);
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGroupBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBasic.f;
    let thirdPartyId =  this.thirdParties.find(x=>x.name === formValues.thirdPartySelected.value  && x.type === this.editBasic.typeThird)?.id;
    let thirdPartyType =  this.editBasic.typeThird;
    let objBasic: User = {
      thirdPartyId: thirdPartyId?.toString(),
      thirdPartyType: thirdPartyType,
      userName: formValues.userName.value,
      name: formValues.name.value,
      phone: formValues.phone.value,
      email: formValues.email.value,
      profile: formValues.profileSelected.value,
      factoryId : formValues.factorySelected.value === 0? null: formValues.factorySelected.value,
      docNumber: formValues.docNumber.value,
      state: (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
      }
      if (this.editMode){
        objBasic.userId = this.userId;
        this.userService.putUser(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.userDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario Actualizado', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
      }else{
        this.userService.postBasic(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.userDialog = false;
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

  generatePassword()
  {
    return Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
  }



}
