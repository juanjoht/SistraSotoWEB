import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerCommercialInfo } from 'src/app/ui/models/customer.model';
import { params } from 'src/app/ui/models/param.model';
import { ParamService } from 'src/app/ui/service/param.service';

interface PriorityGroups {
  name: string;
}


@Component({
  selector: 'app-customer-commercial-edit',
  templateUrl: './customer-commercial-edit.component.html',
  styleUrls: ['./customer-commercial-edit.component.scss']
})
export class CustomerCommercialEditComponent implements OnInit {
  @Input() clientName: string = '';
  @Input() customerCommercialEdit!: CustomerCommercialInfo;
  @Input() viewMode: boolean = false;
  formGroupCommercial!: FormGroup;
  priorityGroups: PriorityGroups[] = [];
  measureUnits: params[] = [];
  clientTypes: params[] = [];
  submittedCommercial: boolean = false;
  assignedQuotaDisabled: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private paramService: ParamService,
    private messageService: MessageService) { }


  ngOnInit() {
    this.priorityGroups = [
      { name: '1' },
      { name: '2' },
      { name: '3' }
     ];
     this.getDocTypes();
     this.getMeasureUnits();

     this.assignedQuotaDisabled = this.viewMode;
     if (Object.keys(this.customerCommercialEdit).length === 0){
     this.formGroupCommercial = this.formBuilder.group({
      priorityGroupSelected: [{value:'',disabled: this.viewMode},[Validators.required]],
      clientTypeSelected:[{value:'',disabled: this.viewMode},[Validators.required]],
      iva:[{value:'',disabled: this.viewMode},[Validators.required]],
      assignedQuota:[{ value: '', disabled: this.assignedQuotaDisabled},[]],
      usedQuota:[{value:'',disabled: this.viewMode},[]],
      availableQuota:[{value:'',disabled: this.viewMode},[]],
      maturityDays:[{value:'',disabled: this.viewMode},[Validators.required]],
      additionalDays:[{value:'',disabled: this.viewMode},[]],
      delayDays:[{value: '',disabled: this.viewMode},[]],
      intermediationPercentage:[{value: '',disabled: this.viewMode},[Validators.required]],
      measureUnitSelected:[{value: '',disabled: this.viewMode},[Validators.required]]
     });
    }
    else
    {
      this.formGroupCommercial = this.formBuilder.group({
        priorityGroupSelected: [{value:this.customerCommercialEdit.priorityGroup, disabled: this.viewMode},[Validators.required]],
        clientTypeSelected:[{value:this.customerCommercialEdit.customerType, disabled: this.viewMode},[Validators.required]],
        iva:[{value: this.customerCommercialEdit.iva, disabled: this.viewMode},[Validators.required]],
        assignedQuota:[{ value: this.customerCommercialEdit.assignedQuota, disabled: this.assignedQuotaDisabled},[]],
        usedQuota:[{value: this.customerCommercialEdit.usedQuota, disabled: this.viewMode},[]],
        availableQuota:[{value: this.customerCommercialEdit.availableQuota, disabled: this.viewMode},[]],
        maturityDays:[{value: this.customerCommercialEdit.maturityDays, disabled: this.viewMode},[Validators.required]],
        additionalDays:[{value: this.customerCommercialEdit.additionalDays, disabled: this.viewMode},[]],
        delayDays:[{value: this.customerCommercialEdit.delayDays, disabled: this.viewMode},[]],
        intermediationPercentage:[{value: this.customerCommercialEdit.intermediationPercentage, disabled: this.viewMode},[Validators.required]],
        measureUnitSelected:[{value: this.customerCommercialEdit.measureUnit, disabled: this.viewMode},[Validators.required]]
       });
    }
     this.formGroupCommercial.controls.clientTypeSelected.valueChanges.subscribe((data) => {
      if( data.toLocaleLowerCase() === "crédito")
      {
        this.formGroupCommercial?.get('assignedQuota')?.enable();
      }
      else
      {
        this.formGroupCommercial?.get('assignedQuota')?.disable();
      }
    })
  }
  get f() { return this.formGroupCommercial?.controls; }


  setValuesEdit(CustomerCommercialInfo : CustomerCommercialInfo)
  {
    if (Object.keys(CustomerCommercialInfo).length !== 0){
    this.formGroupCommercial = this.formBuilder.group({
      priorityGroupSelected: [{value:CustomerCommercialInfo.priorityGroup, disabled: this.viewMode},[Validators.required]],
      clientTypeSelected:[{value:CustomerCommercialInfo.customerType, disabled: this.viewMode},[Validators.required]],
      iva:[{value: CustomerCommercialInfo.iva, disabled: this.viewMode},[Validators.required]],
      assignedQuota:[{ value: CustomerCommercialInfo.assignedQuota, disabled: this.assignedQuotaDisabled},[]],
      usedQuota:[{value: CustomerCommercialInfo.usedQuota, disabled: this.viewMode},[]],
      availableQuota:[{value: CustomerCommercialInfo.availableQuota, disabled: this.viewMode},[]],
      maturityDays:[{value: CustomerCommercialInfo.maturityDays, disabled: this.viewMode},[Validators.required]],
      additionalDays:[{value: CustomerCommercialInfo.additionalDays, disabled: this.viewMode},[]],
      delayDays:[{value: CustomerCommercialInfo.delayDays, disabled: this.viewMode},[]],
      intermediationPercentage:[{value: CustomerCommercialInfo.intermediationPercentage, disabled: this.viewMode},[Validators.required]],
      measureUnitSelected:[{value: CustomerCommercialInfo.measureUnit, disabled: this.viewMode},[Validators.required]]
     });
    }
  }

  getDocTypes(){
    this.paramService.getParamByType('Tipo Cliente')
            .subscribe({
                next: (data:any) => {
                  this.clientTypes = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }

  getMeasureUnits(){
    this.paramService.getParamByType('Unidad de medida')
            .subscribe({
                next: (data:any) => {
                  this.measureUnits = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }


}
