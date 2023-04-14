import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerCommercialInfo } from 'src/app/ui/models/customer.model';
import { CustomerBasicEditComponent } from '../customer/customer-basic-edit.component';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { CustomerCommercialEditComponent } from '../customer/customer-commercial-edit.component';
import { CustomerBuildingsListComponent } from '../customer/customer-buildings-list.component';
import { TransporterBasicInfo } from 'src/app/ui/models/transporter.model';
import { TransporterService } from 'src/app/ui/service/transporter.service';
import { DriverGeneralInfo, DriverInfo } from 'src/app/ui/models/driver.model';
import { DriverService } from 'src/app/ui/service/driver.service';
import { DriverGeneralInfoComponent } from '../driver/driver-general-info.component';

@Component({
  selector: 'app-grid-third-party',
  templateUrl: './grid-third-party.component.html',
  styleUrls: ['./grid-third-party.component.scss']
})
export class GridThirdPartyComponent implements OnInit {
  @Input()title!: string;
  @Input()feature!: string;
  @Input()listGrid: any[] = [];
  @Output() reloadGridParent = new EventEmitter<{ reloadGrid: boolean }>();
  @ViewChild(CustomerBasicEditComponent)editBasic!: CustomerBasicEditComponent;
  @ViewChild(CustomerCommercialEditComponent)editCommercial!: CustomerCommercialEditComponent;
  @ViewChild(CustomerBuildingsListComponent)buildingList!: CustomerBuildingsListComponent;
  @ViewChild(DriverGeneralInfoComponent)editDriverGeneral!: DriverGeneralInfoComponent;

  tabIndex: number = 0;
  customers: CustomerBasicInfo[] = [];
  customerBasic : CustomerBasicInfo = {};
  customerCommercialInfo : CustomerCommercialInfo = {};
  driverGeneralInfo : DriverGeneralInfo = {};
  cols: any[] = [];
  customerDialog: boolean = false;
  showOptions: boolean = true;
  commercialInfoTab: boolean = true;
  buildingListTab: boolean = true;
  transporterListTab: boolean = true;
  shippingListTab: boolean = true;
  routesListTab: boolean = true;
  documentsListTab: boolean = true;
  vehiclesListTab: boolean = true;
  driversListTab: boolean = true;
  driversGeneralInfoTab: boolean = true;
  clientId: number= 0;
  transporterId: number= 0;
  clientName: string  = '';
  clientdoc: string = '';
  transporterName: string  = '';
  editMode: boolean = false;
  isViewMode: boolean = false;
  measureUnit: string=''
  disabledDocInfoEdit: boolean = false;
  constructor(
    private messageService: MessageService,
     private customerService: CustomerService,
     private transporterService: TransporterService,
     private driverService: DriverService,      
     ) { }

  ngOnInit() {
  }

  openNew() {
    this.customerDialog = true;
    this.customerBasic = {};
    this.editMode= false;
    this.commercialInfoTab = true;
    this.buildingListTab = true;
    this.transporterListTab = true;
    this.transporterListTab = true;
    this.shippingListTab = true;
    this.routesListTab = true;
    this.documentsListTab = true;
    this.vehiclesListTab = true;
    this.driversListTab = true;
    this.driversGeneralInfoTab = true;
    this.isViewMode = false;
    this.showOptions = true;
    this.disabledDocInfoEdit = false;

  }

  hideDialog() {
    this.customerDialog = false;
    this.editBasic.submittedBasic = false;
  }

  reloadGridAfterSave()
  {
    this.reloadGridParent.emit({ reloadGrid: true });;
  }

  editCustomer(customerBasic: any, isviewMode: boolean = false) {
    if(this.feature.toLowerCase() === 'conductor'){
      this.driverGeneralInfo.bloodType = customerBasic.bloodType;
      this.driverGeneralInfo.restTime = customerBasic.restTime;
      this.driverGeneralInfo.contact = customerBasic.contact;
      this.driverGeneralInfo.phoneContact = customerBasic.phoneContact;
      this.driverGeneralInfo.comments = customerBasic.comments;
    }
    this.customerDialog = true;
    this.customerBasic  = customerBasic;
    this.commercialInfoTab = false;
    this.buildingListTab = false;
    this.transporterListTab = false;
    this.shippingListTab = false;
    this.routesListTab = false;
    this.documentsListTab = false;
    this.vehiclesListTab = false;
    this.driversListTab = false;
    this.driversGeneralInfoTab = false;
    this.clientName = customerBasic.name as string;
    this.clientId = customerBasic.id as number;
    this.clientdoc = customerBasic.docNumber as string;
    this.editMode= true;
    this.disabledDocInfoEdit = true;
    this.isViewMode = isviewMode;
    this.showOptions = !isviewMode;
   
  }

  getCommercialInfoByClient(clientId : number){
    this.customerService.getCommercialInfoByClient(clientId)
    .subscribe({
        next: (data:any) => {
          this.customerCommercialInfo = data;
          this.measureUnit = this.customerCommercialInfo.measureUnit as string;
          this.editCommercial.setValuesEdit(data);
        },
        error: error => {
          //this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
        }
    });
  }

  
  
  saveContentTabs(){
    if (this.feature.toLowerCase() === 'cliente') {
      switch (this.tabIndex) {
        case 0:
          this.saveCustomerBasic();
          break;
        case 1:
          this.saveCustomerCommercialInfo();
          break;
        default:
          break;
      }
    }
      if (this.feature.toLowerCase() === 'transportador') {
        if (this.tabIndex === 0) {
          this.saveTransporterBasic();
        }
      }
      if(this.feature.toLocaleLowerCase() === 'conductor'){
        switch (this.tabIndex) {
          case 0:
            this.saveDriverBasic();
            break;
          case 1:
            this.saveDriverGeneral();
            break;
          default:
            break;
        }
      }
  }

  saveCustomerBasic()
  {
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGrouBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBasic.f;
    let objBasic: CustomerBasicInfo = {
      docType: formValues.documentTypeSelected.value,
      docNumber: formValues.docNumber.value,
      name: formValues.name.value,
      phone: formValues.phone.value,
      cellPhone: formValues.cellphone.value,
      email: formValues.email.value,
      dept: formValues.deptSelected.value,
      city: formValues.citySelected.value,
      address: formValues.address.value
    }
    if (this.editMode){
      objBasic.id = this.clientId;
      this.customerService.putCustomerBasic(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.clientId = data.id;
              this.clientName = data.nombre;
              this.clientdoc = data.docNumber;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente Actualizado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }else{
      this.customerService.postCustomerBasic(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.clientId = data.id;
              this.clientName = data.nombre;
              this.commercialInfoTab = false;
              this.buildingListTab = false;
              this.transporterListTab = false;
              this.shippingListTab = false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente Creado', life: 3000 });
              if(this.editBasic.thirdPartyType !== '')
              {
                objBasic.id = this.clientId;
                objBasic.payDeadline = formValues.payDeadline.value
                this.saveThirdParty(objBasic);
              }
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }
  }

  saveCustomerCommercialInfo()
  {
    this.editCommercial.submittedCommercial = true;
    if (this.editCommercial.formGroupCommercial.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editCommercial.f;
    let objCommercial: CustomerCommercialInfo = {
    customerId : this.clientId,
    priorityGroup: formValues.priorityGroupSelected?.value,
    customerType: formValues.clientTypeSelected?.value,
    iva: formValues.iva.value === '' ? 0 : formValues.iva.value ,
    assignedQuota: formValues.assignedQuota.value === '' ? 0 : formValues.assignedQuota.value ,
    usedQuota: formValues.usedQuota.value === '' ? 0 : formValues.usedQuota.value ,
    availableQuota: formValues.availableQuota.value === '' ? 0 : formValues.availableQuota.value ,
    maturityDays: formValues.maturityDays.value === '' ? 0 : formValues.maturityDays.value ,
    additionalDays: formValues.additionalDays.value === '' ? 0 : formValues.additionalDays.value ,
    delayDays: formValues.delayDays.value === '' ? 0 : formValues.delayDays.value ,
    intermediationPercentage: formValues.intermediationPercentage.value === '' ? 0 : formValues.intermediationPercentage.value,
    measureUnit: formValues.measureUnitSelected?.value
    }

    if (Object.keys(this.customerCommercialInfo).length !== 0 && (this.customerCommercialInfo.id != 0 || this.customerCommercialInfo.id !== null)){
        objCommercial.id = this.customerCommercialInfo.id;
      this.customerService.putCustomerCommercial(objCommercial)
            .subscribe({
                next: (data) => {
                  if(data !== null)
                  {
                    this.measureUnit = objCommercial.measureUnit as string;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Información Comercial Actualizada', life: 3000 });
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
    }else{
      this.customerService.postCustomerCommercial(objCommercial)
            .subscribe({
                next: (data) => {
                  if(data !== null)
                  {
                    this.measureUnit = objCommercial.measureUnit as string;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Información Comercial Creada', life: 3000 });
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                }
            });
    }
  }

  saveTransporterBasic()
  {
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGrouBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBasic.f;
    let objBasic: TransporterBasicInfo = {
      docType: formValues.documentTypeSelected.value,
      docNumber: formValues.docNumber.value,
      name: formValues.name.value,
      phone: formValues.phone.value,
      cellPhone: formValues.cellphone.value,
      email: formValues.email.value,
      dept: formValues.deptSelected.value,
      city: formValues.citySelected.value,
      address: formValues.address.value,
      payDeadline: formValues.payDeadline.value
      
    }
    if (this.editMode){
      objBasic.id = this.clientId;
      this.transporterService.putTransporterBasic(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.clientId = data.id;
              this.clientName = data.nombre;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Transportador Actualizado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }else{
      this.transporterService.postTransporterBasic(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.clientName = data.nombre;
              this.shippingListTab = false;
              this.routesListTab = false;
              this.documentsListTab = false;
              this.vehiclesListTab = false;
              this.driversListTab = false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Transportador Creado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }
  }

  saveDriverBasic()
  {
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGrouBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBasic.f;
    let objBasic: DriverInfo = {
      docType: formValues.documentTypeSelected.value,
      docNumber: formValues.docNumber.value,
      name: formValues.name.value,
      phone: formValues.phone.value,
      cellPhone: formValues.cellphone.value,
      email: formValues.email.value,
      dept: formValues.deptSelected.value,
      city: formValues.citySelected.value,
      address: formValues.address.value,
      urlUserImg: '',
      state: 'Pendiente Documentación'
    }
    if (this.editMode){
      objBasic.id = this.clientId;
      this.driverService.putDriverBasic(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.clientId = data.id;
              this.clientName = data.nombre;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Conductor Actualizado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }else{
      this.driverService.postDriverBasic(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.clientId = data.id;
              this.clientName = data.nombre;
              this.driversGeneralInfoTab = false;
              this.documentsListTab = false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Conductor Creado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    }
  }

  saveDriverGeneral()
  {
    this.editDriverGeneral.submittedBasic = true;
    if (this.editDriverGeneral.formDriverGeneralBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editDriverGeneral.f;
    let objBasic: DriverGeneralInfo = {
      bloodType: formValues.bloodTypeSelected.value,
      restTime: formValues.restTime.value,
      contact: formValues.contact.value,
      phoneContact: formValues.phone.value,
      comments: formValues.comments.value
    }
      objBasic.driverId = this.clientId;
      this.driverService.putDriverGeneralInfo(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Información General del Conductor Actualizada', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
    
  }

  saveThirdParty(objBasic:any)
  {
    this.customerService.putThirdParty(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tercero Actualizado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
  }

  onChangeTab(event: any){
    this.tabIndex = event.index;
    if(this.feature === 'Cliente')
    {
      this.showOptions = event.index === 2 || event.index === 3 || event.index === 4 ? false: true;
      if(this.editMode)
      {
        if(this.tabIndex === 1)
        {
          this.editCommercial.clientName = this.clientName;
            this.getCommercialInfoByClient(this.clientId);
            this.showOptions = !this.isViewMode;
        }
        if (this.tabIndex === 2)
        {
          this.buildingList.getGridData();
        }
        
      }
    }
    if(this.feature === 'Transportador')
    {
      this.showOptions = event.index === 1 || event.index === 2 || event.index === 3 || event.index === 4 || event.index === 5 ? false: true;
    }
  }
}
