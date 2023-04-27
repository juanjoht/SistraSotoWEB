import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Profile } from 'src/app/ui/models/profile.model';
import { ProfileService } from 'src/app/ui/service/profile.service';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit {
  @Input() profileEdit!: Profile;
  @Input() viewMode: boolean = false;  

  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  constructor(
    private formBuilder: FormBuilder, 
    private profileService:ProfileService,
    private messageService: MessageService) { }
  
    ngOnInit(): void {
      this.submittedBasic = false;
      if (Object.keys(this.profileEdit).length === 0){
        this.formGroupBasic = this.formBuilder.group({
          name: ['', [Validators.required]],
          desc: ['', [Validators.required]],
          stateSelected:[true]
         });
      }else
      {
        this.formGroupBasic = this.formBuilder.group({
          name: [{value:this.profileEdit.name, disabled: this.viewMode}, [Validators.required]],
          desc: [{value: this.profileEdit.desc, disabled: this.viewMode}, []],
          stateSelected:[{value: this.profileEdit.state === 'Activo' ? true: false, disabled: this.viewMode}, []],
         });
      }
    }
    

    get f() { return this.formGroupBasic?.controls; }
}
