import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Depts {
  name: string;
}
interface Cities {
  name: string;
}
interface deliveryConfirmations{
  name: string;
}
interface AllowedVehicleTypes
{
  name: string;
}

@Component({
  selector: 'app-customer-buildings-edit',
  templateUrl: './customer-buildings-edit.component.html',
  styleUrls: ['./customer-buildings-edit.component.scss']
})
export class CustomerBuildingsEditComponent implements OnInit {
  formGroupCustomerBuildings!: FormGroup;
  depts: Depts[] = [];
  cities: Cities[] = [];
  deliveryConfirmations: deliveryConfirmations[] = [];
  allowedVehicleTypes: AllowedVehicleTypes[] = [];
  submittedCustomerBuilding: boolean = false;
  constructor(private formBuilder: FormBuilder) { }
  
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
      times: t
    })
  }
  ngOnInit() {

     this.depts = [
      { name: 'Antioquia' }
     ];
     this.cities = [
      { name: 'Medellin' },
      { name: 'Itagui' },
      { name: 'Envigado' }
     ];
     this.deliveryConfirmations = [
      { name: 'Aplicación' },
      { name: 'Registro Fotográfico' },
      { name: 'Bolsa"' }
     ];
     this.allowedVehicleTypes = [
      { name: 'Volqueta' },
      { name: 'Camión' }
     ]
     const objMonday = this.formBuilder.group(
      {day1:['Lunes'],receive1:[true],times1:['juan']}
      );
      const objTuesday = this.formBuilder.group(
      {day1:['Martes'],receive1:[false],times1:['juan1']}
      );



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

  }
  get f() { return this.formGroupCustomerBuildings?.controls; }
  
 
}
