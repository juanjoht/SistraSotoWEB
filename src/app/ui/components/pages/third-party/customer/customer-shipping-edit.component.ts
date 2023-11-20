import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerShipping } from 'src/app/ui/models/customer.model';
import { params } from 'src/app/ui/models/param.model';
import { route } from 'src/app/ui/models/route.model';
import { ParamService } from 'src/app/ui/service/param.service';
import { RouteService } from 'src/app/ui/service/route.service';

@Component({
  selector: 'app-customer-shipping-edit',
  templateUrl: './customer-shipping-edit.component.html',
  styleUrls: ['./customer-shipping-edit.component.scss']
})
export class CustomerShippingEditComponent implements OnInit {
  @Input() isTransporter: boolean = false;
  @Input() customerShippingEdit!: CustomerShipping;
  @Input() unitMeasure: string = '';
  formGroupShippingRate!: FormGroup;
  submittedShippingRate: boolean = false;
  routes: params[] = [];
  materials: params[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private paramService: ParamService,
    private RouteService: RouteService,
    private messageService: MessageService) { }

  ngOnInit() {
     this.getMaterialsParams();
     this.getRouteList();
     if (Object.keys(this.customerShippingEdit).length === 0){
     this.formGroupShippingRate = this.formBuilder.group({
      routeSelected: ['',[Validators.required]],
      materialSelected: ['', [Validators.required]],
      measureUnit: [{value:this.unitMeasure, disabled: true}],
      shippingValue: ['', [Validators.required]],
      m3Value: ['',],
      tonValue: ['', ],
      stateSelected:[true]
     });
    }else
    {
      this.formGroupShippingRate = this.formBuilder.group({
        routeSelected: [this.customerShippingEdit.routeId,[Validators.required]],
        materialSelected: [this.customerShippingEdit.material, [Validators.required]],
        measureUnit: [{value:this.customerShippingEdit.measureUnit, disabled: true}],
        shippingValue: [this.customerShippingEdit.shippingValue, [Validators.required]],
        m3Value: ['',],
        tonValue: ['', ],
        stateSelected:[this.customerShippingEdit.state === 'Activo' ? true: false]
       });
    }
     if(this.isTransporter)
     {
      if (Object.keys(this.customerShippingEdit).length !== 0){
        this.f["m3Value"].setValue(this.customerShippingEdit.m3Value);
        this.f["tonValue"].setValue(this.customerShippingEdit.tonValue);
      }
      this.f["m3Value"].setValidators(Validators.required);
      this.formGroupShippingRate.get("m3Value")?.updateValueAndValidity();
      this.f["tonValue"].setValidators(Validators.required);
      this.formGroupShippingRate.get("tonValue")?.updateValueAndValidity();
      this.f["shippingValue"].removeValidators(Validators.required);
      this.formGroupShippingRate.get("shippingValue")?.updateValueAndValidity();
     }
  }

  getRouteList(){
    this.RouteService.getRoutesList()
    .subscribe({
        next: (data:any) => {
          this.routes = data;
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
