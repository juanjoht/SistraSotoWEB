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
  @Input() editMode: boolean = false;
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
      assignedQuota:[{ value: '', disabled: this.viewMode},[]],
      usedQuota:[{value:'',disabled: true },[]],
      availableQuota:[{value:'',disabled: true},[]],
      maturityDays:[{value:'',disabled: this.viewMode},[Validators.required]],
      additionalDays:[{value:'',disabled: this.viewMode},[]],
      delayDays:[{value: '', disabled: true},[]],
      measureUnitSelected:[{value: 'm3',disabled: this.viewMode},[Validators.required]],
      creditBalance:[{value: '',disabled: true},[]],
      exclusiveTransport: [{value: false,disabled: this.viewMode},[]]
     });
    }
    if(!this.editMode){
      this.getMaturityDaysDefault();
      this.getIvaDefault();
    }

  }
  get f() { return this.formGroupCommercial?.controls; }

  clientTypeChange(event: any){
        if(event.value.toLocaleLowerCase() === "anticipo")
        {
          this.formGroupCommercial?.get('assignedQuota')?.disable();
        }
        else
        {
          this.formGroupCommercial?.get('assignedQuota')?.enable();
        }
  }
  
  setValuesEdit(CustomerCommercialInfo : CustomerCommercialInfo)
  {
    if (Object.keys(CustomerCommercialInfo).length !== 0){
    this.formGroupCommercial = this.formBuilder.group({
      priorityGroupSelected: [{value:CustomerCommercialInfo.priorityGroup, disabled: this.viewMode},[Validators.required]],
      clientTypeSelected:[{value:CustomerCommercialInfo.customerType, disabled: this.viewMode},[Validators.required]],
      iva:[{value: CustomerCommercialInfo.iva, disabled: this.viewMode},[Validators.required]],
      assignedQuota:[{ value: CustomerCommercialInfo.assignedQuota, disabled: this.viewMode},[]],
      usedQuota:[{value: CustomerCommercialInfo.usedQuota, disabled: true},[]],
      availableQuota:[{value: CustomerCommercialInfo.availableQuota, disabled: true},[]],
      maturityDays:[{value: CustomerCommercialInfo.maturityDays, disabled: this.viewMode},[Validators.required]],
      additionalDays:[{value: CustomerCommercialInfo.additionalDays, disabled: this.viewMode},[]],
      delayDays:[{value: CustomerCommercialInfo.delayDays, disabled: true},[]],
      measureUnitSelected:[{value: CustomerCommercialInfo.measureUnit, disabled: this.viewMode},[Validators.required]],
      creditBalance:[{value: CustomerCommercialInfo.creditBalance, disabled: true},[]],
      exclusiveTransport: [{value: CustomerCommercialInfo.exclusiveTransport,disabled: this.viewMode},[]]
     });
     if(CustomerCommercialInfo?.customerType?.toLocaleLowerCase() === "anticipo")
      {
        this.formGroupCommercial?.get('assignedQuota')?.disable();
      }
      else
      {
        this.formGroupCommercial?.get('assignedQuota')?.enable();
      }
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

  getIvaDefault(){
    this.paramService.getParamByType('Iva')
            .subscribe({
                next: (data:any) => {
                  if(data !== null && data !== undefined && data.length !== 0)
                  {
                    this.formGroupCommercial.get('iva')?.setValue(data[0].name);
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }

  getMaturityDaysDefault(){
    this.paramService.getParamByType('Días de Vencimiento')
            .subscribe({
                next: (data:any) => {
                  if(data !== null && data !== undefined && data.length !== 0)
                  {
                    this.formGroupCommercial.get('maturityDays')?.setValue(data[0].name);
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }


}
