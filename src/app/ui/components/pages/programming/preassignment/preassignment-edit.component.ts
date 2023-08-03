import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerCommercialInfo, CustomerLicensePlate } from 'src/app/ui/models/customer.model';
import { DriverGeneralInfo } from 'src/app/ui/models/driver.model';
import { material } from 'src/app/ui/models/material.model';
import { preassignment } from 'src/app/ui/models/preassignment.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { DriverService } from 'src/app/ui/service/driver.service';
import { MaterialService } from 'src/app/ui/service/material.service';

@Component({
  selector: 'app-preassignment-edit',
  templateUrl: './preassignment-edit.component.html',
  styleUrls: ['./preassignment-edit.component.scss']
})
export class PreassignmentEditComponent implements OnInit{
    @Input() preassignmentEdit!: preassignment;
    @Input() action!: string;
    customers: CustomerBasicInfo[] = []
    customersBuildings: any[] = [];
    materials: material[] = [];
    customerPlates : CustomerLicensePlate[] = [];
    allDrivers: DriverGeneralInfo[] = [];
    customerCommercialInfo : CustomerCommercialInfo = {};
    formGroupBasic!: FormGroup;
    submittedBasic: boolean = false;
    clientID : number = 0;
    clientIDSelected: number = 0;
    defaultDate: Date = new Date();
    today = new Date();
    totalAmountDisabled: boolean = true
    total = 0;
    isEdit: boolean = false;
    disableUnitMeasureControl: boolean = true
    disableControl: boolean = false;
    constructor(private formBuilder: FormBuilder,
        private materialService: MaterialService,
        private customerService: CustomerService, 
        private driverService: DriverService,
        private messageService: MessageService) { 
        }
  
    ngOnInit(): void {
      this.getCustomerList();
      this.getMaterials();
      this.getAllDrivers();
      if (Object.keys(this.preassignmentEdit).length === 0){
      this.isEdit = false;
      this.formGroupBasic = this.formBuilder.group({
        clientSelected: ['',[Validators.required]],
        dateSelected: [this.defaultDate, [Validators.required]],
        buildingSelected: [''],
        materialSelected: ['', [Validators.required]],
        plateSelected: ['', [Validators.required]],
        unitMeasure: [{value : '', disabled : this.disableUnitMeasureControl }],
        amount: [,[Validators.required]],
        driverSelected: ['',[Validators.required]],
        reasonReject: [''],
        state: [],
      });
      }else
      {
        this.disableControl = true;
        this.isEdit = true;
        this.formGroupBasic = this.formBuilder.group({
        clientSelected: [{value : '', disabled : this.disableControl }],
        dateSelected: [{value : new Date(this.preassignmentEdit.originalServiceDate as Date), disabled : this.disableControl }, [Validators.required]],
        buildingSelected: [{value : this.preassignmentEdit.buildingId, disabled : this.disableControl}],
        materialSelected: [{value:  this.preassignmentEdit.materialId, disabled : this.disableControl}],
        plateSelected: [{value:  this.preassignmentEdit.vehicleId, disabled : this.disableControl}],
        unitMeasure: [{value : this.preassignmentEdit.measureUnit, disabled : this.disableControl }],
        amount: [{value: this.preassignmentEdit.amount, disabled: this.disableControl},  [Validators.required]],
        driverSelected: [{value: this.preassignmentEdit.driverId, disabled: this.disableControl},[Validators.required]],
        reasonReject: [''],
        state: [{value: this.preassignmentEdit.state, disabled: false}],
        });

        if(this.action.toLocaleLowerCase() === 'editar' || this.action.toLocaleLowerCase() === 'aprobar' ){
          this.f.plateSelected.enable();
          this.f.driverSelected.enable();
        }
        if(this.action.toLocaleLowerCase() === 'rechazar'){
          this.f.reasonReject.setValidators(Validators.required);
        }else
        {
          this.f.reasonReject.removeValidators(Validators.required)
        }
        

      }
    }
  
    getCustomerList(){
      this.customerService.getCustomerBasic()
      .subscribe({
          next: (data:any) => {
            this.customers = data;
            if (Object.keys(this.preassignmentEdit).length !== 0){
              let idClient = this.getClientId(this.customers, this.preassignmentEdit.clientName) as number;
              this.f.clientSelected.setValue(idClient);
              this.getBuildingsByClient(idClient);
              this.getLicensePlateByClient(idClient);
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
            if (Object.keys(this.preassignmentEdit).length !== 0){
              this.f.buildingSelected.setValue(this.preassignmentEdit.buildingId);
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
      this.getCommercialInfoByClient(this.clientID);  
      this.getLicensePlateByClient(this.clientID);
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

    getLicensePlateByClient(clientId: number){
      this.customerService.getLicensePlatesByClient(clientId)
      .subscribe({
          next: (data:any) => {
            this.customerPlates = data;
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
          }
      });
    }

    getCommercialInfoByClient(clientId: number) {
      this.customerCommercialInfo = {};
      this.customerService.getCommercialInfoByClient(clientId)
      .subscribe({
          next: (data:any) => {
            this.customerCommercialInfo = data;
            this.f.unitMeasure.setValue(this.customerCommercialInfo.measureUnit as string);
          },
          error: error => {
          }
      });
    }

    getAllDrivers(){
      this.driverService.getDrivers()
      .subscribe({
          next: (data:any) => {
            this.allDrivers = data;
          },
          error: (error: { message: any; }) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }
  
    removeTime(date = new Date()) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }
  
    get f() { return this.formGroupBasic?.controls; }
}
