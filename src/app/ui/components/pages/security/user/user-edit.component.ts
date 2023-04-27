import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Profile } from 'src/app/ui/models/profile.model';
import { User, thirdParty } from 'src/app/ui/models/user.model';
import { ProfileService } from 'src/app/ui/service/profile.service';
import { UserService } from 'src/app/ui/service/user.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit{
  @Input() userEdit!: User;
  @Input() viewMode: boolean = false;
  @Input() disabledDocInfo: boolean = false;

  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  thirdParties: thirdParty[] = [];
  profiles: Profile[] = [];
  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private profileService:ProfileService,
    private messageService: MessageService) { }
  
    ngOnInit(): void {
      this.submittedBasic = false;
      this.getThirdParties();
      this.getProfiles();
      if (Object.keys(this.userEdit).length === 0){
        this.formGroupBasic = this.formBuilder.group({
          thirdPartySelected: ['',[Validators.required]],
          userName: ['', [Validators.required,Validators.pattern(/^\S*$/)]],
          name: ['', [Validators.required]],
          phone: ['', [Validators.required]],
          email : ['', [Validators.required,Validators.email]],
          profileSelected:['',[Validators.required]],
          password:[''],
          stateSelected:[true]
         });
      }else
      {
        this.formGroupBasic = this.formBuilder.group({
          thirdPartySelected: [{value: this.userEdit.thirdParty , disabled: this.viewMode},[Validators.required]],
          userName: [{value:this.userEdit.userName, disabled: this.viewMode}, [Validators.required]],
          name: [{value:this.userEdit.name, disabled: this.viewMode}, [Validators.required]],
          phone: [{value: this.userEdit.phone, disabled: this.viewMode}, []],
          email : [{value: this.userEdit.email, disabled: this.viewMode}, [Validators.email]],
          profileSelected:[{value: this.userEdit.profile, disabled: this.viewMode},[Validators.required]],
          password:[{value: this.userEdit.password, disabled: this.viewMode}],
          stateSelected:[{value: this.userEdit.state === 'Activo' ? true: false, disabled: this.viewMode}, [Validators.required]],
         });
      }
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

    get f() { return this.formGroupBasic?.controls; }

}
