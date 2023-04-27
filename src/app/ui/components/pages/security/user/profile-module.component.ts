import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProfileModule } from 'src/app/ui/models/profile.model';
import { ProfileService } from 'src/app/ui/service/profile.service';

@Component({
  selector: 'app-profile-module',
  templateUrl: './profile-module.component.html',
  styleUrls: ['./profile-module.component.scss']
})
export class ProfileModuleComponent implements OnInit {
  @Input()  profileId: number= 0;
  profileModules: ProfileModule[] = [];
  cols: any[] = [];
  showOptions: boolean = true;
  isViewMode: boolean = false;
  
  constructor(
    private messageService: MessageService,
     private profileService:ProfileService
     ) { }
  

  ngOnInit(): void {
    this.getGridData();
    this.cols = [
        { field: 'profileName', header: 'Módulo/Menú' },
        { field: 'permission', header: 'Permiso' }
    ];

  }

  getGridData(){
    this.profileService.getProfileModules(this.profileId)
     .subscribe({
         next: (data:any) => {
           this.profileModules = data;
         },
         error: error => {
           this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
         }
     });
   }

   setPermission(profileModule: ProfileModule)
   {
    console.log(profileModule);
    this.profileService.putProfileModule(profileModule)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Permisos Asignados', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
   }
 

}
