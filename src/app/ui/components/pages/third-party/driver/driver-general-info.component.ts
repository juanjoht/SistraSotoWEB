import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DriverGeneralInfo } from 'src/app/ui/models/driver.model';
import { params } from 'src/app/ui/models/param.model';
import { ParamService } from 'src/app/ui/service/param.service';

@Component({
  selector: 'app-driver-general-info',
  templateUrl: './driver-general-info.component.html',
  styleUrls: ['./driver-general-info.component.scss']
})
export class DriverGeneralInfoComponent {
  @Input() driverGeneralEdit!: DriverGeneralInfo;
  @Input() driverId: number = 0;
  @Input() viewMode: boolean = false;
  
  formDriverGeneralBasic!: FormGroup;
  submittedBasic: boolean = false;
  bloodType: params[] = [];


  constructor(
    private formBuilder: FormBuilder, 
    private paramService: ParamService,
    private messageService: MessageService) { }

    

  ngOnInit() {
    this.submittedBasic = false;
    this.getBloodTypes();
    if (Object.keys(this.driverGeneralEdit).length === 0 || this.driverGeneralEdit.bloodType === null){
      this.formDriverGeneralBasic = this.formBuilder.group({
        bloodTypeSelected: [{value: '' , disabled: this.viewMode},[Validators.required]],
        restTime: [{value:'', disabled: this.viewMode}, [Validators.required]],
        contact: [{value:'', disabled: this.viewMode}, [Validators.required]],
        phone: [{value:'', disabled: this.viewMode}, [Validators.required]],
        comments: [{value: '', disabled: this.viewMode}, []]
       });
    }else
    {
      this.formDriverGeneralBasic = this.formBuilder.group({
        bloodTypeSelected: [{value: this.driverGeneralEdit.bloodType , disabled: this.viewMode},[Validators.required]],
        restTime: [{value:this.driverGeneralEdit.restTime, disabled: this.viewMode}, [Validators.required]],
        contact: [{value:this.driverGeneralEdit.contact, disabled: this.viewMode}, [Validators.required]],
        phone: [{value:this.driverGeneralEdit.phoneContact, disabled: this.viewMode}, [Validators.required]],
        comments: [{value: this.driverGeneralEdit.comments, disabled: this.viewMode}, []]
       });
    }
     

  }



  get f() { return this.formDriverGeneralBasic?.controls; }


  getBloodTypes(){
    this.paramService.getParamByType('Tipo de sangre')
            .subscribe({
                next: (data:any) => {
                  this.bloodType = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }


}
