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

     if (Object.keys(this.customerCommercialEdit).length === 0){
     this.formGroupCommercial = this.formBuilder.group({
      priorityGroupSelected: ['',[Validators.required]],
      clientTypeSelected:['',[Validators.required]],
      iva:['',[Validators.required]],
      assignedQuota:[{ value: '', disabled: this.assignedQuotaDisabled},[]],
      usedQuota:['',[]],
      availableQuota:['',[]],
      maturityDays:['',[Validators.required]],
      additionalDays:['',[]],
      delayDays:['',[]],
      intermediationPercentage:['',[Validators.required]],
      measureUnitSelected:['',[Validators.required]]
     });
    }
    else
    {
      this.formGroupCommercial = this.formBuilder.group({
        priorityGroupSelected: [this.customerCommercialEdit.priorityGroup,[Validators.required]],
        clientTypeSelected:[this.customerCommercialEdit.customerType,[Validators.required]],
        iva:[this.customerCommercialEdit.iva,[Validators.required]],
        assignedQuota:[{ value: this.customerCommercialEdit.assignedQuota, disabled: this.assignedQuotaDisabled},[]],
        usedQuota:[this.customerCommercialEdit.usedQuota,[]],
        availableQuota:[this.customerCommercialEdit.availableQuota,[]],
        maturityDays:[this.customerCommercialEdit.maturityDays,[Validators.required]],
        additionalDays:[this.customerCommercialEdit.additionalDays,[]],
        delayDays:[this.customerCommercialEdit.delayDays,[]],
        intermediationPercentage:[this.customerCommercialEdit.intermediationPercentage,[Validators.required]],
        measureUnitSelected:[this.customerCommercialEdit.measureUnit,[Validators.required]]
       });
    }
     this.formGroupCommercial.controls.clientTypeSelected.valueChanges.subscribe((data) => {
      if( data.name === "Crédito")
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
