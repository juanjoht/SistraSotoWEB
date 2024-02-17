import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerCommercialInfo, CustomerLicensePlate } from 'src/app/ui/models/customer.model';
import { DriverGeneralInfo } from 'src/app/ui/models/driver.model';
import { factory } from 'src/app/ui/models/factory.model';
import { material } from 'src/app/ui/models/material.model';
import { params } from 'src/app/ui/models/param.model';
import { preassignment } from 'src/app/ui/models/preassignment.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { DriverService } from 'src/app/ui/service/driver.service';
import { FactoryService } from 'src/app/ui/service/factory.service';
import { MaterialService } from 'src/app/ui/service/material.service';
import { ParamService } from 'src/app/ui/service/param.service';


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
    allFactories: factory[] = [];
    noveltyTypes: params[] = [];
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
    showNewDateDownload: boolean = false;
    showNewDateNext: boolean = false;
    showComments: boolean = false;
    constructor(private formBuilder: FormBuilder,
        private materialService: MaterialService,
        private customerService: CustomerService, 
        private driverService: DriverService,
        private factoryService: FactoryService,
        private paramService: ParamService,
        private messageService: MessageService) { 
        }
  
    ngOnInit(): void {
      this.getCustomerList();
      this.getMaterials();
      this.getAllDrivers();
      this.getAllFactories();
      this.getNoveltyTypes();
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
        factorySelected: ['',[Validators.required]],
        reasonReject: [''],
        state: [],
        obs: [''],
        noveltyTypeSelected: [''],
        dateDownloadSelected: [''],
        dateNextSelected: [''],
        requestNumber :  ['']
        //noveltyTypeSelected : ['',[Validators.required]]
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
        factorySelected: [{value: this.preassignmentEdit.factoryId, disabled: this.disableControl},[Validators.required]],
        reasonReject: [''],
        obs: [''],
        state: [{value: this.preassignmentEdit.state, disabled: false}],
       // noveltyTypeSelected: [{value: this.preassignmentEdit.driverId, disabled: this.disableControl},[Validators.required]],
        noveltyTypeSelected: [''],
        dateDownloadSelected: [{value : ''}],
        dateNextSelected: [{value : ''}],
        requestNumber :  [{value: this.preassignmentEdit.id, disabled: true}]
        });

        if(this.action.toLocaleLowerCase() === 'editar' || this.action.toLocaleLowerCase() === 'aprobar' || this.action.toLocaleLowerCase() === 'registrar novedad'){
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

    getNoveltyTypes(){
      this.paramService.getParamByType("Tipo de Novedad").
      subscribe(
        {
          next: (data) => {
            this.noveltyTypes = data;
          }
        }
      )
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

    getCustomerTransporterVehicleList(){
      return this.customerService.getCustomerTransporterVehicle(this.preassignmentEdit.vehicleId as number)
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

    changeNoveltyType(event: any){
        switch (event.value) {
          case 'Desvío':
            this.f.clientSelected.enable();
            this.f.buildingSelected.enable();
            this.getCustomerTransporterVehicleList();
            this.f.obs.removeValidators(Validators.required);
            this.f.dateDownloadSelected.removeValidators(Validators.required);
            this.showComments = false;
            this.showNewDateDownload = false;
            this.showNewDateNext = false;
          break;
          case 'Trasbordo':
            this.f.clientSelected.disable();
            this.f.buildingSelected.disable();
            this.getCustomerList();
            this.f.obs.setValidators(Validators.required);
            this.f.dateDownloadSelected.removeValidators(Validators.required);
            this.showComments = true;
            this.showNewDateDownload = false;
            this.showNewDateNext = false;
          break;
          case 'Cambio de hora descargue':
            this.f.clientSelected.disable();
            this.f.buildingSelected.disable();
            this.getCustomerList();
            this.f.obs.setValidators(Validators.required);
            this.f.dateDownloadSelected.setValidators(Validators.required);
            this.f.dateNextSelected.removeValidators(Validators.required);
            this.showComments = true;
            this.showNewDateDownload = true;
            this.showNewDateNext = false;
          break;
          case 'Cambio de hora próxima disponibilidad':
            this.f.clientSelected.disable();
            this.f.buildingSelected.disable();
            this.getCustomerList();
            this.f.obs.setValidators(Validators.required);
            this.f.dateDownloadSelected.removeValidators(Validators.required);
            this.f.dateNextSelected.setValidators(Validators.required);
            this.showComments = true;
            this.showNewDateDownload = false;
            this.showNewDateNext = true;
          break;
          default:
            this.f.clientSelected.disable();
            this.f.buildingSelected.disable();
            break;
        }
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

    getAllFactories(){
      this.factoryService.getFactory()
      .subscribe({
          next: (data:any) => {
            this.allFactories = data;
          },
          error: (error: { message: any; }) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
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
