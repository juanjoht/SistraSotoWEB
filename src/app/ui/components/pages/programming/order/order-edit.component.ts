import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';
import { factory } from 'src/app/ui/models/factory.model';
import { material } from 'src/app/ui/models/material.model';
import { order } from 'src/app/ui/models/order.model';
import { params } from 'src/app/ui/models/param.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { FactoryService } from 'src/app/ui/service/factory.service';
import { MaterialService } from 'src/app/ui/service/material.service';
import { ParamService } from 'src/app/ui/service/param.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {
  @Input() orderEdit!: order;
  @Input() feature!: string;
  @Input() isEditAprove!: boolean;
  @Output() disableSaveParent = new EventEmitter<{ disabledSave: boolean }>();
  customers: CustomerBasicInfo[] = []
  customersBuildings: any[] = [];
  materials: material[] = [];
  measureUnits: params[] = [];
  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  clientID : number = 0;
  clientIDSelected: number = 0;
  defaultMonday: Date = this.setCurrentMonday(new Date());
  today = new Date();
  nextweek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+7);
  totalAmountDisabled: boolean = true
  total = 0;
  isEdit: boolean = false;
  allFactories: factory[] = [];
  measureUnit: string = '';
  constructor(private formBuilder: FormBuilder,
      private materialService: MaterialService,
      private customerService: CustomerService,
      private factoryService:FactoryService,
      private paramService: ParamService, 
      private messageService: MessageService) { 
      }



  selectStartDate(event : any){
        let selectedDate = event;
        if(this.removeTime(selectedDate) < this.removeTime(this.defaultMonday))
        {
          this.disableSaveParent.emit({ disabledSave: true });
        }else
          this.disableSaveParent.emit({ disabledSave: false });
    }

  ngOnInit(): void {
    this.getCustomerList();
    this.getMaterials();
    this.getAllFactories();
    this.getMeasureUnits();
    if (Object.keys(this.orderEdit).length === 0){
    this.isEdit = false;
    this.formGroupBasic = this.formBuilder.group({
      factorySelected:['',[Validators.required]],
      clientSelected: ['',[Validators.required]],
      startDateSelected: [this.defaultMonday, [Validators.required]],
      buildingSelected: ['', [Validators.required]],
      materialSelected: ['', [Validators.required]],
      measureUnitSelected:[{value:'',disabled : true}],
      automatic: [false],
      monday: [0],
      tuesday: [0],
      wednesday: [0],
      thursday: [0],
      friday: [0],
      saturday: [0],
      sunday: [0],
      totalAmount: [,[Validators.required]]
    });
    }else
    {
      let disableControl: boolean = true;
      let disableControlEdit: boolean = true;
      let disableApproveAmount: boolean = true;
      if(this.orderEdit.deliveredAmount !== undefined && this.orderEdit.deliveredAmount !== 0)
      {
        disableControlEdit = false;
      }
       
      if (this.isEditAprove){
        disableApproveAmount = false;
      }
      this.isEdit = true;
      this.formGroupBasic = this.formBuilder.group({
      factorySelected: [{value : this.orderEdit.factoryId, disabled : disableControl }],
      clientSelected: [{value : '', disabled : disableControl }],
      startDateSelected: [{value : new Date(this.orderEdit.startDate as Date), disabled : disableControl }, [Validators.required]],
      buildingSelected: [{value : this.orderEdit.buildingId, disabled : disableControl}],
      materialSelected: [{value:  this.orderEdit.materialId, disabled : false}],
      measureUnitSelected: [{value:  this.orderEdit.UnitMeasure, disabled : disableControl}],
      automatic: [{value:  this.orderEdit.automatic, disabled : disableControl}],
      monday: [{value :this.orderEdit.monday, disabled : disableControl}],
      tuesday: [{value :this.orderEdit.tuesday, disabled : disableControl}],
      wednesday: [{value :this.orderEdit.wednesday, disabled : disableControl}],
      thursday: [{value :this.orderEdit.thursday, disabled : disableControl}],
      friday: [{value :this.orderEdit.friday, disabled : disableControl}],
      saturday: [{value :this.orderEdit.saturday, disabled : disableControl}],
      sunday: [{value :this.orderEdit.sunday, disabled : disableControl}],
      totalAmount: [{value: this.orderEdit.requestAmount, disabled: false},  [Validators.required]],
      amountApprove: [{value: this.orderEdit.aprobeAmount, disabled: disableApproveAmount},[Validators.required]],
      deliverApprove: [{value: this.orderEdit.deliveredAmount, disabled: false},[Validators.required]],
      state: [{value: this.orderEdit.state, disabled: false}],
      });
    }
  }
  changeAmount()
  {
    if (this.isEdit){
      if(this.f.totalAmount.value < this.f.deliverApprove.value){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La cantidad ingresada no puede ser menor a la cantidad despachada', life: 5000 });
        this.f.materialSelected.disable();
        return;
      }else
      {
        this.f.materialSelected.enable();
      }
    }
    
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

  getDefaultFactory(){
    this.paramService.getParamByType('Planta por Defecto')
            .subscribe({
                next: (data:any) => {
                  this.f.factorySelected.setValue(parseInt(data[0].name));
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }

  getAllFactories(){
    this.factoryService.getFactory()
    .subscribe({
        next: (data:any) => {
          this.allFactories = data;
          if(!this.isEdit){
            this.getDefaultFactory();
          }
        },
        error: (error: { message: any; }) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  getCustomerList(){
    this.customerService.getCustomerBasic()
    .subscribe({
        next: (data:any) => {
          this.customers = data;
          if (Object.keys(this.orderEdit).length !== 0){
            let idClient = this.getClientId(this.customers, this.orderEdit.clientName) as number;
            this.f.clientSelected.setValue(idClient);
            this.getBuildingsByClient(idClient);
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  getClientId(data: CustomerBasicInfo[], name: any){
    return data.find(x=> x.name === name)?.id
  }

  getBuildingsByClient(clientId: number){
    this.customerService.getBuildingsByClient(clientId)
    .subscribe({
        next: (data:any) => {
          this.customersBuildings = data;
          if (Object.keys(this.orderEdit).length !== 0){
            this.f.buildingSelected.setValue(this.orderEdit.buildingId);
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  getCommercialInfoByClient(clientId : number){
    this.customerService.getCommercialInfoByClient(clientId)
    .subscribe({
        next: (data:any) => {
          this.measureUnit = data.measureUnit as string;
          this.f.measureUnitSelected.setValue(this.measureUnit);
        },
        error: error => {
          //this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
        }
    });
  }

  changeClient(event: any){
    this.clientID = event.value as number;
    this.getBuildingsByClient(this.clientID); 
    this.getCommercialInfoByClient(this.clientID); 
  }

  getMaterials(){
    this.materialService.getMaterial()
    .subscribe({
        next: (data:any) => {
          this.materials = data;
        },
        error: (error: { message: any; }) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  setCurrentMonday(date: Date) {
    let day = date.getDay() || 7;  
    if( day !== 1 ) 
        date.setHours(-24 * (day - 1)); 
    return date;
  } 

  removeTime(date = new Date()) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  sumAmountDays(){
    this.total = this.f.monday.value +  this.f.tuesday.value +  this.f.wednesday.value +  this.f.thursday.value +  this.f.friday.value +  this.f.saturday.value + this.f.sunday.value;
    this.totalAmountDisabled = (this.total === undefined  || this.total === null || this.total === 0 ) ? false: true;
    this.f.sunday.value;
    
    if(this.totalAmountDisabled)
    {
      this.f.totalAmount.disable()
      this.f.totalAmount.setValue(this.total);
      this.f.totalAmount.removeValidators(Validators.required);
    }else
    {
      this.f.totalAmount.setValue('');
      this.f.totalAmount.enable();
      this.f.totalAmount.setValidators(Validators.required);
    }
    
  }

  get f() { return this.formGroupBasic?.controls; }
}
