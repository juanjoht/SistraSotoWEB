import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Cities, Depts } from 'src/app/ui/models/param-static.model';
import { params } from 'src/app/ui/models/param.model';
import { ParamStaticService } from 'src/app/ui/service/param-static.service';
import { ParamService } from 'src/app/ui/service/param.service';



@Component({
  selector: 'app-customer-buildings-edit',
  templateUrl: './customer-buildings-edit.component.html',
  styleUrls: ['./customer-buildings-edit.component.scss']
})
export class CustomerBuildingsEditComponent implements OnInit {
  formGroupCustomerBuildings!: FormGroup;
  depts: Depts[] = [];
  cities: Cities[] = [];
  deliveryConfirmations: params[] = [];
  allowedVehicleTypes: params[] = [];
  submittedCustomerBuilding: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private paramStaticService: ParamStaticService,
    private paramService: ParamService,
    private messageService: MessageService
    ) { }
  
  getControls(){
    return (<FormArray>this.formGroupCustomerBuildings.get('days')).controls;
  }
  get days() : FormArray {
    return this.formGroupCustomerBuildings.get('days') as FormArray
  }

  newDay(d: string,r:boolean,t:string): FormGroup {
    return this.formBuilder.group({
      day: [{value:d, disabled: true}],
      receive: r,
      times: [t,Validators.required]
    })
  }
  ngOnInit() {

    this.getDepts();
    this.getDeliveryConfirmations();
    this.getAllowedVehicleTypes();

    this.formGroupCustomerBuildings = this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      deptSelected:['',[Validators.required]],
      citySelected:['',[Validators.required]],
      address:['', [Validators.required]],
      email : ['', [Validators.email]],
      scaleSelected: ['', []],
      latitude: ['', []],
      length: ['', []],
      manageSoto13: ['', []],
      queueWaitingTime: ['', [Validators.required]],
      tolerancePercentage: ['', [Validators.required]],
      deliveryConfirmationSelected: ['', [Validators.required]],
      allowedVehicleTypesSelected : ['', [Validators.required]],
      simpleLoadingTime : ['', [Validators.required]],
      doubleLoadingTime : ['', [Validators.required]],
      truckLoadingTime: ['', [Validators.required]],
      days: this.formBuilder.array([])
     });
     this.days.push(this.newDay("Lunes",false,""));
     this.days.push(this.newDay("Martes",false,""));
     this.days.push(this.newDay("Miercoles",false,""));
     this.days.push(this.newDay("Jueves",false,""));
     this.days.push(this.newDay("Viernes",false,""));
     this.days.push(this.newDay("Sabado",false,""));
     this.days.push(this.newDay("Domingo",false,"")); 

     this.formGroupCustomerBuildings.controls.deptSelected.valueChanges.subscribe((data) => {
      this.getCities(data.id)
     });
  }
  get f() { return this.formGroupCustomerBuildings?.controls; }
  
  changeDept(event: any)
  {
    let deptId = this.depts.find(x=>x.name === event.value)?.id as string;
    this.getCities(deptId);
  }

  getDepts(){
    this.paramStaticService.getDepts()
            .subscribe({
                next: (data:any) => {
                  this.depts = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }

  getCities(id: string){
    this.paramStaticService.getCitiesByDept(id)
    .subscribe({
        next: (data:any) => {
          console.log(data);
          this.cities = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  getDeliveryConfirmations(){
    this.paramService.getParamByType('Confirmación de entrega')
            .subscribe({
                next: (data:any) => {
                  this.deliveryConfirmations = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });                  
                }
            });
  }

  getAllowedVehicleTypes(){
    this.paramService.getParamByType('Tipos de vehículos permitidos')
            .subscribe({
                next: (data:any) => {
                  this.allowedVehicleTypes = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });                  
                }
            });
  }
 
}
