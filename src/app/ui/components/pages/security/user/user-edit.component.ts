import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Profile } from 'src/app/ui/models/profile.model';
import { ProviderBasicInfo, ProviderFactories } from 'src/app/ui/models/provider.model';
import { User, thirdParty } from 'src/app/ui/models/user.model';
import { ProfileService } from 'src/app/ui/service/profile.service';
import { ProviderService } from 'src/app/ui/service/provider.service';
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
  clientID : string = '';
  typeThird: string = '';
  providerFactories: ProviderFactories[] = [];
  providers: ProviderBasicInfo[] = [];
  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private providerService: ProviderService,
    private profileService:ProfileService,
    private messageService: MessageService) { }
  
    ngOnInit(): void {
      this.submittedBasic = false;
      this.getThirdParties();
      this.getProfiles();
      this.geProviderdData();
      if (Object.keys(this.userEdit).length === 0){
        this.formGroupBasic = this.formBuilder.group({
          thirdPartySelected: ['',[Validators.required]],
          userName: ['', [Validators.required,Validators.pattern(/^\S*$/)]],
          name: ['', [Validators.required]],
          phone: ['', [Validators.required]],
          email : ['', [Validators.required,Validators.email]],
          profileSelected:['',[Validators.required]],
          password:[''],
          factorySelected: [{value:0, disabled: true}],
          docNumber:[''],
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
          factorySelected: [{value: this.userEdit.factoryId,  disabled: this.viewMode}],
          docNumber: [{value: this.userEdit.docNumber,  disabled: this.viewMode}],
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


    changeClient(value: any, isProv: boolean){
      this.typeThird = isProv ? 'PROVEEDOR' :  value.originalEvent !== undefined? value.originalEvent?.currentTarget?.children?.item(0).firstChild?.innerHTML: value;
      this.clientID = isProv ? value: value.value !== undefined? value.value : value;
      let isProvider  = this.providers.find(c => c.name === this.clientID)
      if (isProvider){
            let providerID = isProvider?.id;
            this.getFactoriesByProvider(providerID as number)
            this.f.factorySelected.enable();
            this.f.factorySelected.setValidators(Validators.required);
            this.formGroupBasic.get("factorySelected")?.updateValueAndValidity();
          }else
          {
              if(this.typeThird === 'CONDUCTOR')
              {
                this.f["docNumber"].setValidators(Validators.required);
                this.formGroupBasic.get("docNumber")?.updateValueAndValidity();
              }else
              {
                this.f.docNumber.removeValidators(Validators.required);
                this.formGroupBasic.get("docNumber")?.updateValueAndValidity();
              }
            this.f.factorySelected.disable();
            this.f.factorySelected.removeValidators(Validators.required);
            this.formGroupBasic.get("factorySelected")?.updateValueAndValidity();
          }
    }

    getFactoriesByProvider(providerId: number){
    this.providerService.getProviderFactories(providerId)
    .subscribe({
        next: (data:any) => {
          this.providerFactories = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
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

    geProviderdData(){
      this.providerService.getProvider()
      .subscribe({
          next: (data:any) => {
            this.providers = data;
            if (Object.keys(this.userEdit).length !== 0){
              if(this.userEdit.thirdPartyType === 'PROVEEDOR'){
                this.changeClient(this.userEdit.thirdParty, true);
              }else
              {
                this.changeClient(this.userEdit.thirdPartyType, false);
              }
              
            }
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            console.log(error);
          }
      });
    }
  

    get f() { return this.formGroupBasic?.controls; }

}
