import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Cities, Depts } from 'src/app/ui/models/param-static.model';
import { params } from 'src/app/ui/models/param.model';
import { schedule } from 'src/app/ui/models/schedule.model';
import { ParamStaticService } from 'src/app/ui/service/param-static.service';
import { ParamService } from 'src/app/ui/service/param.service';
import { ScheduleService } from 'src/app/ui/service/schedule.service';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import { ProviderFactories } from 'src/app/ui/models/provider.model';
 

interface hours {
  name?: string;
  value?: number;
}
@Component({
  selector: 'app-provider-factories-edit',
  templateUrl: './provider-factories-edit.component.html',
  styleUrls: ['./provider-factories-edit.component.scss']
})
export class ProviderFactoriesEditComponent implements OnInit {
  @Input() ProviderFactoriesEdit!: ProviderFactories;
  @Input() viewMode: boolean = false;
  formGroupProviderFactories!: FormGroup;
  depts: Depts[] = [];
  cities: Cities[] = [];
  zones: params[] = [];
  schedules: schedule[] = [];
  schedule!: schedule;
  hoursList :hours[] = []
  deliveryConfirmations: params[] = [];
  allowedVehicleTypes: params[] = [];
  submittedProviderFactories: boolean = false;
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
    return (<FormArray>this.formGroupProviderFactories.get('days')).controls;
  }
  get days() : FormArray {
    return this.formGroupProviderFactories.get('days') as FormArray
  }
  val: any[] = [];
  changeAllowed(event: any){
    this.val.push(event.itemValue)
  }

  onchangeReceive(e: any, index: number)
  {
    let days = this.formGroupProviderFactories.controls.days as FormArray;
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
    this.getZones();
    if (Object.keys(this.ProviderFactoriesEdit).length === 0){
        this.formGroupProviderFactories = this.formBuilder.group({
        name: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        contactName: ['', [Validators.required]],
        deptSelected:['',[Validators.required]],
        citySelected:['',[Validators.required]],
        zoneSelected:['',[Validators.required]],
        address:['', [Validators.required]],
        email : ['', [Validators.email]],
        latitude: ['', []],
        length: ['', []],
        haveSoto13: [false, []],
        enterDoc: [false, []],
        stateSelected:[true]
      });   
      this.scheduleService.getSchedules().then((data:schedule[]) => (this.schedules = data));
    }
    else
    {
      this.isEdit = true;
      this.formGroupProviderFactories = this.formBuilder.group({
        name: [{value:this.ProviderFactoriesEdit.name, disabled: this.viewMode}, [Validators.required]],
        phone: [{value:this.ProviderFactoriesEdit.phone, disabled: this.viewMode}, [Validators.required]],
        contactName: [{value:this.ProviderFactoriesEdit.contactName, disabled: this.viewMode}, [Validators.required]],
        deptSelected:[{value:this.ProviderFactoriesEdit.dept, disabled: this.viewMode},[Validators.required]],
        citySelected:[{value:this.ProviderFactoriesEdit.city, disabled: this.viewMode},[Validators.required]],
        zoneSelected:[{value:this.ProviderFactoriesEdit.zone, disabled: this.viewMode},[Validators.required]],
        address:[{value:this.ProviderFactoriesEdit.address, disabled: this.viewMode}, [Validators.required]],
        email : [{value:this.ProviderFactoriesEdit.email, disabled: this.viewMode}, [Validators.email]],
        latitude: [{value:this.ProviderFactoriesEdit.latitude, disabled: this.viewMode}, []],
        length: [{value:this.ProviderFactoriesEdit.length, disabled: this.viewMode}, []],
        haveSoto13: [{value:this.ProviderFactoriesEdit.haveSoto13System, disabled: this.viewMode}, []],
        enterDoc: [{value:this.ProviderFactoriesEdit.enterDoc, disabled: this.viewMode}, []],
        stateSelected:[{value: this.ProviderFactoriesEdit.state === 'Activo' ? true: false, disabled: this.viewMode}],
      });
      let recTimes = this.ProviderFactoriesEdit.workTimes?.split(';');
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
  get f() { return this.formGroupProviderFactories?.controls; }
  
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
                  if (Object.keys(this.ProviderFactoriesEdit).length !== 0){
                    let deptId = this.depts.find(x=>x.name === this.ProviderFactoriesEdit.dept)?.id as string;
                    this.getCities(deptId);
                    this.f["citySelected"].setValue(this.ProviderFactoriesEdit.city);
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

 /* addNewCycle(){
    const stH:hours = {name : "00:00", value: 0}
      const enH:hours = {name : "00:00", value: 0}
    this.cycles.push(this.newCycle(this.cycles.length,stH,enH));
  }*/

 /* removeNewCycle(index: number){
    this.cycles.removeAt(index);
  }*/

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
 
}
