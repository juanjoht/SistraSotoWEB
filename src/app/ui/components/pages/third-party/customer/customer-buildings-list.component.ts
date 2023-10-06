import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBuildings } from 'src/app/ui/models/customer.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { CustomerBuildingsEditComponent } from './customer-buildings-edit.component';

@Component({
  selector: 'app-customer-buildings-list',
  templateUrl: './customer-buildings-list.component.html',
  styleUrls: ['./customer-buildings-list.component.scss']
})
export class CustomerBuildingsListComponent implements OnInit {
  @Input() clientName: string = '';
  @Input() clientId: number = 0; 
  @Input() viewMode: boolean = false;
  @ViewChild(CustomerBuildingsEditComponent)editBuilding!: CustomerBuildingsEditComponent;
  customersBuildings: CustomerBuildings[] = [];
  customerBuilding: CustomerBuildings = {};
  customerBuildingDialog: boolean = false;
  editMode: boolean = false;
  viewModeDialog: boolean = false;
  buildingId: number = 0;
  cols: any[] = [];
  showOptions: boolean = true;
  constructor(
    private customerService: CustomerService,
    private messageService: MessageService) { }
  
  ngOnInit() {

    this.cols = [
        { field: 'name', header: 'Nombre' },
        { field: 'city', header: 'Municipio' },
        { field: 'address', header: 'Dirección' },
        { field: 'state', header: 'Estado' }
    ];
  }

  openNewBuilding()
  {
    this.customerBuildingDialog = true;
    this.editMode = false;
    this.viewModeDialog= false;
    this.customerBuilding = {};
  }

  editCustomerBuilding(customerBuilding: CustomerBuildings, isviewMode: boolean = false) {
    this.customerBuildingDialog = true;
    this.editMode = true;
    this.customerBuilding  = customerBuilding;
    this.viewModeDialog= isviewMode;
    this.buildingId = customerBuilding.id as number;
    this.showOptions = !isviewMode;
  }

  getGridData(){
    this.customerService.getBuildingsByClient(this.clientId)
    .subscribe({
        next: (data:any) => {
          this.customersBuildings = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  hideDialog()
  {
    this.customerBuildingDialog = false;
  }

  saveCustomerBuilding()
  {
    this.editBuilding.submittedCustomerBuilding = true;
    if (this.editBuilding.formGroupCustomerBuildings.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBuilding.f;
    let formValuesArray  = this.editBuilding.schedules;
    let recTimes : string = '';
    formValuesArray.forEach((element: any, index: number) => {
      recTimes += `${element.day}=recibe/${element.receive}-tiempo/${element.schedule};`
    });
    let objbuilding: CustomerBuildings = {
      customerId:this.clientId,          
      name: formValues.name.value,
      phone: formValues.phone.value,
      contactName: formValues.contactName.value,
      dept: formValues.deptSelected.value,
      city: formValues.citySelected.value,
      zone: formValues.zoneSelected.value,
      address: formValues.address.value,
      email: formValues.email.value,
      scale: formValues.scaleSelected.value,
      latitude: formValues.latitude.value,
      length: formValues.length.value,
      isAdminBySoto13: formValues.manageSoto13.value,
      tolerancePercentage: formValues.tolerancePercentage.value,
      deliveryConfirmation: formValues.deliveryConfirmationSelected.value,
      receptionTimes: recTimes.slice(0, -1),
      allCost: formValues.allCost.value,
      allowedVehicleTypes: formValues.allowedVehicleTypesSelected.value.join(','),
      intermediationPercentage: formValues.intermediationPercentage.value,
      profitability: formValues.profitability.value,
      roadCondition: formValues.roadCondition.value,
      unloadingAgility: formValues.unloadingAgility.value,
      weightedRating: this.editBuilding.weightedRating,
      state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
    }
    if (this.editMode){
      objbuilding.id = this.buildingId;
      this.customerService.putCustomerBuilding(objbuilding)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.customerBuildingDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Obra del Cliente Actualizada', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }else{
      this.customerService.postCustomerBuilding(objbuilding)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.customerBuildingDialog = false;
                      this.getGridData();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Obra del Cliente Creada', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                    console.log(error);
                  }
              });
      }
  }
}
