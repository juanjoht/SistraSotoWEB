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
  @ViewChild(CustomerBuildingsEditComponent)editBuilding!: CustomerBuildingsEditComponent;
  customersBuildings: CustomerBuildings[] = [];
  customerBuildingDialog: boolean = false;
  

  cols: any[] = [];
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
  }

  getGridData(){
    this.customerService.getBuildingsByClient(this.clientId)
    .subscribe({
        next: (data:any) => {
          this.customersBuildings = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.details, life: 5000 });
          console.log(error);
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
      return;
    }
    let formValues  = this.editBuilding.f;
    let formValuesArray  = this.editBuilding.f.days.value;
    let recTimes : string = '';
    formValuesArray.forEach((element: any) => {
      recTimes = `lunes=recibe:${element.receive},tiempo:${element.times}};
      martes=recibe:${element.receive},tiempo:${element.times}};
      miercoles=recibe:${element.receive},tiempo:${element.times}};
      jueves=recibe:${element.receive},tiempo:${element.times}};
      viernes=recibe:${element.receive},tiempo:${element.times}};
      sabado=recibe:${element.receive},tiempo:${element.times}};
      domingo=recibe:${element.receive},tiempo:${element.times}};
      `
    });
    let objbuilding: CustomerBuildings = {
      customerId:this.clientId,          
      name: formValues.name.value,
      phone: formValues.phone.value,
      contactName: formValues.contactName.value,
      dept: formValues.deptSelected.value,
      city: formValues.citySelected.value,
      address: formValues.address.value,
      email: formValues.email.value,
      scale: formValues.scaleSelected.value,
      latitude: formValues.latitude.value,
      length: formValues.length.value,
      isAdminBySoto13: formValues.manageSoto13.value,
      queueWaitingTime: formValues.queueWaitingTime.value,
      tolerancePercentage: formValues.tolerancePercentage.value,
      deliveryConfirmation: formValues.deliveryConfirmationSelected.value,
      receptionTimes: recTimes,
      allowedVehicleTypes: formValues.allowedVehicleTypesSelected.value,
      loadingTime:`simple:${formValues.simpleLoadingTime.value};doble:${formValues.doubleLoadingTime.value};tractomula:${formValues.truckLoadingTime.value}`,
      state: "Activo"      
    }
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
