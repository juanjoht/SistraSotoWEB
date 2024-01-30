import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Common } from 'src/app/common/common';
import { CustomerBuildingOrder } from 'src/app/ui/models/customer.model';
import { preassignment } from 'src/app/ui/models/preassignment.model';
import { VehiclePlate } from 'src/app/ui/models/vehicles.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { MaterialService } from 'src/app/ui/service/material.service';
import { PreassignmentService } from 'src/app/ui/service/preassignment.service';
import { VehicleService } from 'src/app/ui/service/vehicle.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-plant-load',
  templateUrl: './plant-load.component.html',
  styleUrls: ['./plant-load.component.scss']
})
export class PlantLoadComponent implements OnInit {
  disableControl: boolean = false;
  showDocNumber: boolean = false;
  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  preassignments: preassignment[] = [];
  vehicles: VehiclePlate[] = [];
  filteredPlates: VehiclePlate[] = [];
  labelState: string = 'Iniciar Cargue';
  labelDisabled: boolean = true;
  showOptions: boolean = false;
  showOptionsEditable: boolean = false;
  customersBuildings: CustomerBuildingOrder[] = [];
  materialsBuilding: any[] = [];
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private preassignmentService:  PreassignmentService,
              private customerService: CustomerService,
              private materialService: MaterialService,
              private vehicleService: VehicleService,  
              private messageService: MessageService){}
  ngOnInit(): void {
      this.getAllVehicles()
      this.disableControl = true;
      this.formGroupBasic = this.formBuilder.group({
      plateSelected: [{value : '',disabled: false},[Validators.required]],
      anticipatedSelected : [{value : false,disabled: false}],
      clientSelected: [{value : '', disabled : this.disableControl }],
      buildingSelected: [{value : '', disabled : this.disableControl}],
      materialSelected: [{value:  '', disabled : this.disableControl}],
      unitMeasure: [{value : '', disabled : this.disableControl }],
      amount: [{value: '', disabled: this.disableControl}],
      docNumberSelected: [{value: '', disabled: this.disableControl}]
      });
  }

  getAllVehicles(){
    this.vehicleService.getVehiclePlate()
    .subscribe({
        next: (data:any) => {
          this.vehicles = data;
        },
        error: (error: { message: any; }) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  filterByPlate(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.vehicles as any[]).length; i++) {
        let country = (this.vehicles as any[])[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
    this.filteredPlates = filtered;
}

  changePlate(e: any)
  {
    this.submittedBasic = true;
    if (this.formGroupBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
      this.preassignmentService.getPreassignmentByPlate(e.name, Common.FactoryId, this.f.anticipatedSelected.value)
      .subscribe({
          next: (data:any) => {
            this.preassignments = data;
            if(this.preassignments.length === 0)
            {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No tiene viajes para cargar', life: 5000 });
            }
            else
            {
              let dataFromServer = this.preassignments[0];
              if(dataFromServer.state !== 'Cargando' && dataFromServer.state !== 'Aprobado'){
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No tiene viajes para cargar', life: 5000 });
              }else{
                this.showOptions = true;
                this.f.clientSelected.setValue(dataFromServer.clientName);
                this.f.buildingSelected.setValue(dataFromServer.buildingName);
                this.f.materialSelected.setValue(dataFromServer.materialName);
                this.f.unitMeasure.setValue(dataFromServer.measureUnit);
                this.f.amount.setValue(dataFromServer.amount);
                if(dataFromServer.state === 'Aprobado'){
                  this.labelDisabled = false;
                  this.labelState = 'Inicio Cargue';
                  if (dataFromServer.allowChangesLoanPlant)
                  {
                    this.showOptionsEditable = true;
                    this.f.buildingSelected.enable();
                    this.f.buildingSelected.addValidators(Validators.required);
                    const clientID = dataFromServer.clientId || 0;
                    this.getBuildingsByClient(clientID, dataFromServer.buildingName || "");
                    this.f.materialSelected.enable();
                    this.f.materialSelected.addValidators(Validators.required);
                  }else
                  {
                    this.f.buildingSelected.disable();
                    this.f.buildingSelected.removeValidators(Validators.required);
                    this.f.materialSelected.disable();
                    this.f.materialSelected.removeValidators(Validators.required);
                  }
                }else if (dataFromServer.state === 'Cargando')
                {
                  if(dataFromServer.factoryEnterDoc && !dataFromServer.buildingAllCost){
                   this.showDocNumber = true;
                   this.f.docNumberSelected.enable();
                   this.f.docNumberSelected.addValidators(Validators.required);
                  }else{
                    this.showDocNumber = true;
                    this.f.docNumberSelected.disable();
                    this.f.docNumberSelected.setValue(dataFromServer.id);
                    this.f.docNumberSelected.removeValidators(Validators.required);
                  }
                  this.labelDisabled = false;
                  this.labelState = 'Completar cargue';
                }else
                {
                  this.labelDisabled = true;
                }
              }
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
            console.log(error);
          }
      });
  }

  load(){
    this.submittedBasic = true;
      if (this.formGroupBasic.invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
        return;
      }
    let objBasic: preassignment= {};
    if(this.preassignments.length !== 0){
      objBasic.id = this.preassignments[0].id;
      objBasic.serviceDate= this.preassignments[0].serviceDate;
      objBasic.buildingId= this.preassignments[0].buildingId;  
      objBasic.materialId= this.preassignments[0].materialId;
      objBasic.measureUnit= this.preassignments[0].measureUnit;
      objBasic.amount = this.preassignments[0].amount;
      objBasic.vehicleId=  this.preassignments[0].vehicleId;
      objBasic.driverId= this.preassignments[0].driverId;
      objBasic.factoryId= this.preassignments[0].factoryId;
  }
    switch (this.labelState) {
      case 'Inicio Cargue':
          objBasic.state = 'Cargando';
        break;
        case 'Completar cargue':
          objBasic.state = 'En Tránsito';
        break;
      default:
        break;
        
    }
    if(this.preassignments.length !== 0){
      this.preassignmentService.putPreassignment(objBasic)
          .subscribe({
              next: (data) => {
                if(data !== null)
                {
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Preasignación Actualizada', life: 3000 });
                  this.submittedBasic = false;
                  this.formGroupBasic.reset();
                  this.showOptions = false;
                  this.showOptionsEditable = false;
                }
              },
              error: error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
              }
        });
      }
  }

  cancel(){
    this.router.navigate(["/dashboard"])
  }

  getBuildingsByClient(clientId: number, buildingName: string){
    this.customerService.getBuildingsByClientOrder(clientId)
    .subscribe({
        next: (data:any) => {
          this.customersBuildings = data;
          const buildingId = this.customersBuildings.find(x => x.name === buildingName)?.id;
          if(buildingId !== undefined){
            this.getMaterialsByBuilding(buildingId);
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  getMaterialsByBuilding(buildingId: number){
    this.materialService.getMaterialOrder(buildingId)
    .subscribe({
        next: (data:any) => {
          this.materialsBuilding = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  changeBuildings(e: any){
    const val = e.value;
    const buildingId = this.customersBuildings.find(x => x.name === val)?.id;
    if(buildingId !== undefined){
      this.preassignments[0].buildingId = buildingId;
      this.getMaterialsByBuilding(buildingId);
    }
  }

  getMaterialsData(e: any)
  {
    const materialId = this.materialsBuilding.find(x => x.name === e.value)?.id;
    this.preassignments[0].materialId = materialId;
    if(this.preassignments[0].measureUnit?.toLowerCase() === 'toneladas')
    {
      this.materialService.getMaterialById(materialId).subscribe({
        next: (data:any) => {
          if(data !== undefined)
          {
              const unitMass = data.unitMass;
              const vehicleID = this.preassignments[0].vehicleId;
              this.vehicleService.getVehicleById(vehicleID || 0).subscribe({
                next: (dataq:any) => {
                    if(dataq !== undefined)
                    {
                      const capacity = dataq.capacityTon;
                      this.preassignments[0].amount = this.roundToTwo(unitMass * capacity) || 0;
                      this.f.amount.setValue(this.preassignments[0].amount);
                    }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                }
          })
        }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
      });
    }
  }

  roundToTwo(num: any) {
    const n = Number(num + "e+2")
    return +(Math.round(n)  + "e-2");
  }

  get f() { return this.formGroupBasic?.controls; }

}
