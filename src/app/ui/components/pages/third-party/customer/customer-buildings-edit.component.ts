import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBuildings } from 'src/app/ui/models/customer.model';
import { Cities, Depts } from 'src/app/ui/models/param-static.model';
import { params } from 'src/app/ui/models/param.model';
import { schedule } from 'src/app/ui/models/schedule.model';
import { ParamStaticService } from 'src/app/ui/service/param-static.service';
import { ParamService } from 'src/app/ui/service/param.service';
import { ScheduleService } from 'src/app/ui/service/schedule.service';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
 

interface hours {
  name?: string;
  value?: number;
}
@Component({
  selector: 'app-customer-buildings-edit',
  templateUrl: './customer-buildings-edit.component.html',
  styleUrls: ['./customer-buildings-edit.component.scss']
})
export class CustomerBuildingsEditComponent implements OnInit {
  @Input() customerBuildingEdit!: CustomerBuildings;
  @Input() viewMode: boolean = false;
  formGroupCustomerBuildings!: FormGroup;
  depts: Depts[] = [];
  cities: Cities[] = [];
  zones: params[] = [];
  schedules: schedule[] = [];
  schedule!: schedule;
  hoursList :hours[] = []
  deliveryConfirmations: params[] = [];
  allowedVehicleTypes: params[] = [];
  submittedCustomerBuilding: boolean = false;
  isEdit: boolean = false;
  scheduleDialog: boolean = false;
  formSchedules!: FormArray;
  formGroupSchedules!: FormGroup;
  submittedShedule: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private paramStaticService: ParamStaticService,
    private paramService: ParamService,
    private messageService: MessageService,
    private scheduleService: ScheduleService
    ) { }
  
  getControls(){
    return (<FormArray>this.formGroupCustomerBuildings.get('days')).controls;
  }
  get days() : FormArray {
    return this.formGroupCustomerBuildings.get('days') as FormArray
  }
  val: any[] = [];
  changeAllowed(event: any){
    this.val.push(event.itemValue)
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
    return form;
  }



  ngOnInit() {
    this.getDepts();
    this.getDeliveryConfirmations();
    this.getAllowedVehicleTypes();
    this.getZones();
    this.getWights();
    if (Object.keys(this.customerBuildingEdit).length === 0){
        this.formGroupCustomerBuildings = this.formBuilder.group({
        name: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        contactName: ['', [Validators.required]],
        deptSelected:['',[Validators.required]],
        citySelected:['',[Validators.required]],
        zoneSelected:['',[Validators.required]],
        address:['', [Validators.required]],
        email : ['', [Validators.email]],
        scaleSelected: ['', []],
        latitude: ['', []],
        length: ['', []],
        manageSoto13: [false, []],
        tolerancePercentage: ['', [Validators.required]],
        intermediationPercentage: ['', [Validators.required]],
        allCost: [false, []],
        deliveryConfirmationSelected: ['', [Validators.required]],
        allowedVehicleTypesSelected : [<params[] | null>(null), [Validators.required]],
        profitability : [0, [Validators.required]],
        roadCondition : [0, [Validators.required]],
        unloadingAgility: [0, [Validators.required]],
        stateSelected:[true]
      });   
      this.scheduleService.getSchedules().then((data:schedule[]) => (this.schedules = data));
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
        allCost: [{value:this.customerBuildingEdit.allCost, disabled: this.viewMode}, []],
        tolerancePercentage: [{value:this.customerBuildingEdit.tolerancePercentage, disabled: this.viewMode}, [Validators.required]],
        intermediationPercentage: [{value:this.customerBuildingEdit.intermediationPercentage, disabled: this.viewMode}, [Validators.required]],
        deliveryConfirmationSelected: [{value:this.customerBuildingEdit.deliveryConfirmation, disabled: this.viewMode}, [Validators.required]],
        allowedVehicleTypesSelected : [{value:this.customerBuildingEdit.allowedVehicleTypes?.split(','), disabled: this.viewMode}, [Validators.required]],
        profitability : [{value:this.customerBuildingEdit.profitability, disabled: this.viewMode}, [Validators.required]],
        roadCondition : [{value:this.customerBuildingEdit.roadCondition, disabled: this.viewMode}, [Validators.required]],
        unloadingAgility: [{value:this.customerBuildingEdit.unloadingAgility, disabled: this.viewMode}, [Validators.required]],
        stateSelected:[{value: this.customerBuildingEdit.state === 'Activo' ? true: false, disabled: this.viewMode}],
      });
      this.weightedRating = this.customerBuildingEdit?.weightedRating;
      let recTimes = this.customerBuildingEdit.receptionTimes?.split(';');
      recTimes?.forEach((element: any, index: number) => {
         let item = element?.split('-')[0];
         let itemD = item.split('=');
         let day = itemD[0];
         let receive = itemD[1];
         let valReceive = receive?.split('/')[1];
         let valTimes = element?.split('/')[2];
         let objSh = {
          id: index.toString(),
          day: day,
          receive: valReceive,
          schedule: valTimes
        }
        this.schedules.push(objSh);
      }); 
    }
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

  getZones(){
    this.paramService.getParamByType('Zona')
            .subscribe({
                next: (data:any) => {
                  this.zones = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });                  
                }
            });
  }

  newCycle(numberCycle: number,startHour:hours,endHour:hours): FormGroup {
    let i = numberCycle + 1;
    let form =  this.formBuilder.group({
      numberCycle: [{value:i, disabled: true}],
      startHour: [{value:startHour,disabled: false}],
      endHour: [{value:endHour,disabled: false}]
    },
    { 
      validators: [this.matchHours('startHour', 'endHour'),this.validateRange('startHour', 'endHour')] 
    })
    return form;
  }

  matchHours(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if(control.value !== '' && matchingControl.value !== ''){
          const start = new Date();
          start.setHours(control.value.name.split(':')[0], control.value.name.split(':')[1], 0); 
          const end = new Date();
          end.setHours(matchingControl.value.name.split(':')[0], matchingControl.value.name.split(':')[1], 0);

          if (start >= end) {
              matchingControl.setErrors({ matchValidator: true });
          } else if (!matchingControl.errors?.rangeValidator) {
              matchingControl.setErrors(null);
          }
      }
    }
  }


  get cycles() : FormArray {
    return this.formGroupSchedules.get('cycles') as FormArray
  }

  getControlsCycles(){
    return (<FormArray>this.formGroupSchedules.get('cycles')).controls;
  }

  editSchedule(schedule: schedule) {
    this.submittedShedule = true;
    this.schedule = { ...schedule };
    this.scheduleDialog = true;
    this.getHours();
    this.formGroupSchedules = new FormGroup({
      cycles: this.formBuilder.array([])
    });
    if(this.schedule.schedule !== ''){
      let hoursEdit: any = this.schedule?.schedule?.split(',');
      hoursEdit.forEach((element: any, i: number) => {
        if(element.trim() !== ''){
          const hourS = element.trim().split('-')[0];
          const hourF = element.trim().split('-')[1];
          let hs = parseFloat(`${hourS.split(':')[0]}.${hourS.split(':')[1].replace('30','5')}`);
          let hf = parseFloat(`${hourF.split(':')[0]}.${hourF.split(':')[1].replace('30','5')}`)
          const stH:hours = {name : hourS, value: hs};
          const enH:hours = {name : hourF, value: hf};
          this.cycles.push(this.newCycle(i,stH,enH));
        }
      });
    }else
    {
      const stH:hours = {name : "00:00", value: 0}
      const enH:hours = {name : "00:00", value: 0}
      this.cycles.push(this.newCycle(0,stH,enH));
    }
  }

  validateIntervalOverlaps(controlName: string,matchingControlName: string)  {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if(control  && matchingControl){
        const s = extendMoment(moment);
        const timeInterval = s.range(moment(control.value.value), moment(matchingControl.value.value));
        const overlappingInterval = this.cycles.controls.filter(intervalItem => {
          let st = intervalItem.get('startHour')?.value.value;
          let ed = intervalItem.get('endHour')?.value.value;
  
          const interval = s.range(moment(st), moment(ed))
          return timeInterval.overlaps(interval)
        });
        if (!matchingControl.errors?.matchValidator) {
          matchingControl.setErrors(null);
        }
        if (overlappingInterval.length !== 0) {
          if(overlappingInterval.length > 1){
            matchingControl.setErrors({ rangeValidator: true });
          }
        }
      }
    }
  }

  validateRange(controlName: string,matchingControlName: string)  {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if(control.value !== '' && matchingControl.value !== ''){
        const start = control.value.value;
        const end = matchingControl.value.value;
        const overlappingInterval = this.cycles.controls.filter(intervalItem => {
          const st = intervalItem.get('startHour')?.value.value;
          const ed = intervalItem.get('endHour')?.value.value;
          const interval = (start >= st && start < ed) || (end > st && end <= ed)
          return interval
        });

        if (!matchingControl.errors?.matchValidator) {
          matchingControl.setErrors(null);
        }
        if (overlappingInterval.length !== 0) {
          if(overlappingInterval.length > 1){
            matchingControl.setErrors({ rangeValidator: true });
          }
        }
       }
    }
  }
 

 

  saveSchedule(){
    this.submittedShedule = true;
     if (this.formGroupSchedules.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hay errores en el formulario, por favor validar.', life: 5000 });
      return;
    }
    if (this.schedule.id) {
      let hours: FormArray = this.cycles as FormArray;
      this.schedule.receive = 'Si';
      this.schedule.schedule = '';
      hours.value.forEach((element: any) => {
        this.schedule.schedule += `${element.startHour.name}-${element.endHour.name}, `  
      });
      this.schedules[this.findIndexById(this.schedule.id)] = this.schedule;
      this.scheduleDialog = false;
    }    
  }  

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.schedules.length; i++) {
        if (this.schedules[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

  addNewCycle(){
    const stH:hours = {name : "00:00", value: 0}
      const enH:hours = {name : "00:00", value: 0}
    this.cycles.push(this.newCycle(this.cycles.length,stH,enH));
  }

  removeNewCycle(index: number){
    this.cycles.removeAt(index);
  }

  getHours(){
    const start = new Date();
    start.setHours(0, 0, 0); 
    const end = new Date();
    end.setHours(23, 59, 0);

    while (start <= end) {
      this.hoursList.push({name : start.toLocaleString('en-US', {hour: '2-digit', minute: '2-digit',hour12: false}).replace('24','00'), value: parseFloat(`${start.getHours()}.${start.getMinutes().toString().replace('30','5')}`)})
      start.setMinutes(start.getMinutes() + 30);
    }
  }

  changeStartHour(value: any, index: any){
    let hours = this.cycles as FormArray;
    console.log(hours.controls[index].get('startHour')?.value);
    console.log(hours.controls[index].get('endHour')?.value);

    console.log(value);
    console.log(this.cycles);

  }

  changeEndHour(value: any,index: any){
    console.log(value);
    console.log(this.cycles);
  }
  profitabilityWieght = 1;
  aglityWieght = 1;
  roadStateyWieght = 1;
  weightedRating: number | undefined = 0;

  getWights(){
    this.paramService.getParamByType('Pesos Calificación Ponderada')
            .subscribe({
                next: (data:any) => {
                  const existProfitabilityWieght= data.find((x: any)=> x.name.trim().toLowerCase().includes('rentabilidad'));
                  if (existProfitabilityWieght !== undefined){
                    this.profitabilityWieght = parseInt(existProfitabilityWieght.value1);
                  }
                  const existroadStateyWieght= data.find((x: any)=> x.name.trim().toLowerCase().includes('estado'));
                   if (existroadStateyWieght !== undefined ){
                    this.roadStateyWieght = parseInt(existroadStateyWieght.value1);
                  }
                  const existAglityWieght= data.find((x: any)=> x.name.trim().toLowerCase().includes('agilidad'));
                  if (existAglityWieght !== undefined){
                    this.aglityWieght = parseInt(existAglityWieght.value1);
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });                  
                }
            });
  }

  getweightedRating()
  {
    this.weightedRating = ((this.f.profitability.value * this.profitabilityWieght) + (this.f.roadCondition.value * this.roadStateyWieght)	 + (this.f.unloadingAgility.value * this.roadStateyWieght))
    / (this.profitabilityWieght + this.roadStateyWieght + this.roadStateyWieght);
  }
 
}
