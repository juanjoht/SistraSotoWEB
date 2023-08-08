import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CustomerBuildings } from 'src/app/ui/models/customer.model';
import { Cities, Depts } from 'src/app/ui/models/param-static.model';
import { params } from 'src/app/ui/models/param.model';
import { ParamStaticService } from 'src/app/ui/service/param-static.service';
import { ParamService } from 'src/app/ui/service/param.service';



@Component({
  selector: 'app-customer-buildings-edit',
  templateUrl: './customer-buildings-edit.component.html',
  styleUrls: ['./customer-buildings-edit.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CustomerBuildingsEditComponent implements OnInit {
  @Input() customerBuildingEdit!: CustomerBuildings;
  @Input() viewMode: boolean = false;
  formGroupCustomerBuildings!: FormGroup;
  depts: Depts[] = [];
  cities: Cities[] = [];
  zone: Array<any>[] = [];
  deliveryConfirmations: params[] = [];
  allowedVehicleTypes: params[] = [];
  submittedCustomerBuilding: boolean = false;
  isEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private paramStaticService: ParamStaticService,
    private paramService: ParamService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) { }

    addHorary(e: Event, index:number) {

      console.log(e);
      console.log(index);
      
      
  }
  
  getControls(){
    return (<FormArray>this.formGroupCustomerBuildings.get('days')).controls;
  }
  get days() : FormArray {
    return this.formGroupCustomerBuildings.get('days') as FormArray
  }

  onchangeReceive(e: any, index: number)
  {
    let days = this.formGroupCustomerBuildings.controls.days as FormArray;
    if(e.checked){
      days.controls[index].get('times')?.setValidators(Validators.required);
      days.controls[index].get('times')?.updateValueAndValidity();
    }else
    {
      days.controls[index].get('times')?.removeValidators(Validators.required);
      days.controls[index].get('times')?.updateValueAndValidity();
    }
  }

  newDay(d: string,r:boolean,t:string): FormGroup {
    let form =  this.formBuilder.group({
      day: [{value:d, disabled: true}],
      receive: [{value:r,disabled: this.viewMode}],
      times: [{value:t,disabled: this.viewMode}]
    })
    /*form.controls.receive.valueChanges.subscribe((data) => {
      if(data)
      {
        form.get("times")?.setValidators(Validators.required);
      }
      else
      {
        form.controls.times.removeValidators(Validators.required);
      }
      form.updateValueAndValidity();
    })*/
    return form;
  }
  ngOnInit() {

    this.getDepts();
    this.getDeliveryConfirmations();
    this.getAllowedVehicleTypes();
    this.getZone();
    if (Object.keys(this.customerBuildingEdit).length === 0){
        this.formGroupCustomerBuildings = this.formBuilder.group({
        name: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        contactName: ['', [Validators.required]],
        deptSelected:['',[Validators.required]],
        citySelected:['',[Validators.required]],
        zoneSelected: ['', [Validators.required]],
        address:['', [Validators.required]],
        email : ['', [Validators.email]],
        scaleSelected: ['', []],
        latitude: ['', []],
        length: ['', []],
        manageSoto13: ['', []],
        tolerancePercentage: ['', [Validators.required]],
        intermediationPercentage: ['', [Validators.required]],
        deliveryConfirmationSelected: ['', [Validators.required]],
        allowedVehicleTypesSelected : ['', [Validators.required]],
        days: this.formBuilder.array([]),
        stateSelected:[true],
        allCosteSelected:[false]
      });
         
      this.days.push(this.newDay("Lunes",false,""));
      this.days.push(this.newDay("Martes",false,""));
      this.days.push(this.newDay("Miercoles",false,""));
      this.days.push(this.newDay("Jueves",false,""));
      this.days.push(this.newDay("Viernes",false,""));
      this.days.push(this.newDay("Sabado",false,""));
      this.days.push(this.newDay("Domingo",false,"")); 
    }
    else
    {
      this.isEdit = true;
      this.formGroupCustomerBuildings = this.formBuilder.group({
        name: [{value:this.customerBuildingEdit.name, disabled: this.viewMode}, [Validators.required]],
        phone: [{value:this.customerBuildingEdit.phone, disabled: this.viewMode}, [Validators.required]],
        contactName: [{value:this.customerBuildingEdit.contactName, disabled: this.viewMode}, [Validators.required]],
        deptSelected:[{value:this.customerBuildingEdit.dept, disabled: this.viewMode},[Validators.required]],
        citySelected:[{value:this.customerBuildingEdit.city, disabled: this.viewMode},[Validators.required]],
        zoneSelected:[{value:this.customerBuildingEdit.zone, disabled: this.viewMode},[Validators.required]],
        address:[{value:this.customerBuildingEdit.address, disabled: this.viewMode}, [Validators.required]],
        email : [{value:this.customerBuildingEdit.email, disabled: this.viewMode}, [Validators.email]],
        scaleSelected: [{value:this.customerBuildingEdit.scale, disabled: this.viewMode}, []],
        latitude: [{value:this.customerBuildingEdit.latitude, disabled: this.viewMode}, []],
        length: [{value:this.customerBuildingEdit.length, disabled: this.viewMode}, []],
        manageSoto13: [{value:this.customerBuildingEdit.isAdminBySoto13, disabled: this.viewMode}, []],
        tolerancePercentage: [{value:this.customerBuildingEdit.tolerancePercentage, disabled: this.viewMode}, [Validators.required]],
        intermediationPercentage: [{value:this.customerBuildingEdit.intermediationPercentage, disabled: this.viewMode}, [Validators.required]],
        deliveryConfirmationSelected: [{value:this.customerBuildingEdit.deliveryConfirmation, disabled: this.viewMode}, [Validators.required]],
        allowedVehicleTypesSelected : [{value:this.customerBuildingEdit.allowedVehicleTypes, disabled: this.viewMode}, [Validators.required]],
        days: this.formBuilder.array([]),
        stateSelected:[{value: this.customerBuildingEdit.state === 'Activo' ? true: false, disabled: this.viewMode}],
        allCosteSelected:[{value: this.customerBuildingEdit.state === 'Activo' ? true: false, disabled: this.viewMode}],
      });

      let recTimes = this.customerBuildingEdit.receptionTimes?.split(';');
      recTimes?.forEach((element: any, index: number) => {
        let day:string = '';
        switch (index) {
          case 0:
            day = "Lunes"
          break;
          case 1:
            day = "Martes"
          break;
          case 2:
            day = "Miercoles"
          break;
          case 3:
            day = "Jueves"
          break;
          case 4:
            day = "Viernes"
          break;
          case 5:
            day = "Sabado"
          break; 
          case 6:
            day = "Domingo"
          break;
          default:
            break;
        }
         let itemDays = element?.split(',');
         let receive = itemDays[0];
         let time = itemDays[1];
         let valReceive = receive?.split(':')[1] === 'true'? true : false;
         let valTimes = time?.split(':')[1];
         this.days.push(this.newDay(day, valReceive,valTimes));
      }); 
    }
  }
  get f() { return this.formGroupCustomerBuildings?.controls; }

  getHorarios(e: any, index: number){
    console.log(e)
    console.log(index);
    ;
    
  }
  
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
                  if (Object.keys(this.customerBuildingEdit).length !== 0){
                    let deptId = this.depts.find(x=>x.name === this.customerBuildingEdit.dept)?.id as string;
                    this.getCities(deptId);
                    this.f["citySelected"].setValue(this.customerBuildingEdit.city);
                  }
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
          this.f["zoneSelected"].setValue(this.customerBuildingEdit.zone);
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  getZone(){
    this.paramService.getParamByType("Zona").subscribe({
      next:(data) => {
        console.log(data);
        this.zone = data;
      },
      error:(error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
      }
    })
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
                  console.log(data);
                  this.allowedVehicleTypes = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });                  
                }
            });
  }
 
}
