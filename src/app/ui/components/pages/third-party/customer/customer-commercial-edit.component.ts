import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerCommercialInfo } from 'src/app/ui/models/customer.model';

interface PriorityGroups {
  name: string;
}
interface ClientTypes {
  name: string;
}
interface measureUnits {
  name: string;
}

@Component({
  selector: 'app-customer-commercial-edit',
  templateUrl: './customer-commercial-edit.component.html',
  styleUrls: ['./customer-commercial-edit.component.scss']
})
export class CustomerCommercialEditComponent implements OnInit {
  formGroupCommercial!: FormGroup;
  customerCommercial: CustomerCommercialInfo = {};
  priorityGroups: PriorityGroups[] = [];
  measureUnits: measureUnits[] = [];
  clientTypes: ClientTypes[] = [];
  submittedCommercial: boolean = false;
  assignedQuotaDisabled: boolean = true;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.priorityGroups = [
      { name: '1' },
      { name: '2' },
      { name: '3' }
     ];
     this.clientTypes = [
      { name: 'Crédito' },
      { name: 'Contado' }
     ];
     this.measureUnits = [
      { name: 'm3' },
      { name: 'ton' }
     ];

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

  clientTypeSelect(event: any)
  {
    console.log(event.value)
  }

}
