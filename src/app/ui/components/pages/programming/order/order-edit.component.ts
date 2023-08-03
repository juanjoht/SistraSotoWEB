import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';
import { material } from 'src/app/ui/models/material.model';
import { order } from 'src/app/ui/models/order.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { MaterialService } from 'src/app/ui/service/material.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {
  @Input() orderEdit!: order;
  @Input() feature!: string;
  @Output() disableSaveParent = new EventEmitter<{ disabledSave: boolean }>();
  customers: CustomerBasicInfo[] = []
  customersBuildings: any[] = [];
  materials: material[] = [];
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
  constructor(private formBuilder: FormBuilder,
      private materialService: MaterialService,
      private customerService: CustomerService, 
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
  
    if (Object.keys(this.orderEdit).length === 0){
    this.isEdit = false;
    this.formGroupBasic = this.formBuilder.group({
      clientSelected: ['',[Validators.required]],
      startDateSelected: [this.defaultMonday, [Validators.required]],
      buildingSelected: ['', [Validators.required]],
      materialSelected: ['', [Validators.required]],
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
      let disableControl: boolean = false;
      if (this.feature === 'approve'){
        disableControl = true;
        this.totalAmountDisabled = true;
      }
      this.isEdit = true;
      this.formGroupBasic = this.formBuilder.group({
      clientSelected: [{value : '', disabled : disableControl }],
      startDateSelected: [{value : new Date(this.orderEdit.startDate as Date), disabled : disableControl }, [Validators.required]],
      buildingSelected: [{value : this.orderEdit.buildingId, disabled : disableControl}],
      materialSelected: [{value:  this.orderEdit.materialId, disabled : disableControl}],
      monday: [{value :this.orderEdit.monday, disabled : disableControl}],
      tuesday: [{value :this.orderEdit.tuesday, disabled : disableControl}],
      wednesday: [{value :this.orderEdit.wednesday, disabled : disableControl}],
      thursday: [{value :this.orderEdit.thursday, disabled : disableControl}],
      friday: [{value :this.orderEdit.friday, disabled : disableControl}],
      saturday: [{value :this.orderEdit.saturday, disabled : disableControl}],
      sunday: [{value :this.orderEdit.sunday, disabled : disableControl}],
      totalAmount: [{value: this.orderEdit.totalAmount, disabled: this.totalAmountDisabled},  [Validators.required]],
      amountApprove: [{value: this.orderEdit.totalAmount, disabled: false},[Validators.required]],
      state: [{value: this.orderEdit.state, disabled: false}],
      });
    }
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

  changeClient(event: any){
    this.clientID = event.value as number;
    this.getBuildingsByClient(this.clientID);  
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
