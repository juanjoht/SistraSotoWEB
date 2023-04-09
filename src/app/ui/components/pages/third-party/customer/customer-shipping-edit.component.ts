import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerShipping } from 'src/app/ui/models/customer.model';
import { params } from 'src/app/ui/models/param.model';
import { ParamService } from 'src/app/ui/service/param.service';

@Component({
  selector: 'app-customer-shipping-edit',
  templateUrl: './customer-shipping-edit.component.html',
  styleUrls: ['./customer-shipping-edit.component.scss']
})
export class CustomerShippingEditComponent implements OnInit {
  @Input() isTransporter: boolean = false;
  @Input() customerShippingEdit!: CustomerShipping;
  formGroupShippingRate!: FormGroup;
  submittedShippingRate: boolean = false;
  origins: params[] = [];
  destinations: params[] = [];
  materials: params[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private paramService: ParamService,
    private messageService: MessageService) { }

  ngOnInit() {
     this.getOriginsParams();
     this.getDestinationsParams();
     this.getMaterialsParams();
     if (Object.keys(this.customerShippingEdit).length === 0){
     this.formGroupShippingRate = this.formBuilder.group({
      originSelected: ['',[Validators.required]],
      destinationSelected: ['', [Validators.required]],
      materialSelected: ['', [Validators.required]],
      measureUnit: [{value:'', disabled: true}],
      shippingValue: ['', [Validators.required]],
      m3Value: ['',],
      tonValue: ['', ]
     });
    }else
    {
      this.formGroupShippingRate = this.formBuilder.group({
        originSelected: [this.customerShippingEdit.origin,[Validators.required]],
        destinationSelected: [this.customerShippingEdit.destination, [Validators.required]],
        materialSelected: [this.customerShippingEdit.material, [Validators.required]],
        measureUnit: [{value:'', disabled: true}],
        shippingValue: [this.customerShippingEdit.shippingValue, [Validators.required]],
        m3Value: ['',],
        tonValue: ['', ]
       });
    }
     if(this.isTransporter)
     {
      this.f["m3Value"].setValidators(Validators.required);
      this.formGroupShippingRate.get("m3Value")?.updateValueAndValidity();
      this.f["tonValue"].setValidators(Validators.required);
      this.formGroupShippingRate.get("tonValue")?.updateValueAndValidity();
      this.f["shippingValue"].removeValidators(Validators.required);
      this.formGroupShippingRate.get("shippingValue")?.updateValueAndValidity();
     }


  }

  getOriginsParams(){
    this.paramService.getParamByType('Origen')
            .subscribe({
                next: (data:any) => {
                  this.origins = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }

  getDestinationsParams(){
    this.paramService.getParamByType('Destino')
            .subscribe({
                next: (data:any) => {
                  this.destinations = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }

  getMaterialsParams(){
    this.paramService.getParamByType('Material')
            .subscribe({
                next: (data:any) => {
                  this.materials = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }


  get f() { return this.formGroupShippingRate?.controls; }

}