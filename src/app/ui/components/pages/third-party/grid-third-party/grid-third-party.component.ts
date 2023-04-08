import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerCommercialInfo } from 'src/app/ui/models/customer.model';
import { CustomerBasicEditComponent } from '../customer/customer-basic-edit.component';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { CustomerCommercialEditComponent } from '../customer/customer-commercial-edit.component';
import { CustomerBuildingsListComponent } from '../customer/customer-buildings-list.component';

@Component({
  selector: 'app-grid-third-party',
  templateUrl: './grid-third-party.component.html',
  styleUrls: ['./grid-third-party.component.scss']
})
export class GridThirdPartyComponent implements OnInit {
  @Input()title!: string;
  @Input()feature!: string;
  @Input()listGrid: any[] = [];
  @ViewChild(CustomerBasicEditComponent)editBasic!: CustomerBasicEditComponent;
  @ViewChild(CustomerCommercialEditComponent)editCommercial!: CustomerCommercialEditComponent;
  @ViewChild(CustomerBuildingsListComponent)buildingList!: CustomerBuildingsListComponent;
  tabIndex: number = 0;
  customers: CustomerBasicInfo[] = [];
  customerBasic : CustomerBasicInfo = {};
  customerCommercialInfo : CustomerCommercialInfo = {};
  cols: any[] = [];
  customerDialog: boolean = false;
  showOptions: boolean = true;
  commercialInfoTab: boolean = true;
  buildingListTab: boolean = true;
  transporterListTab: boolean = true;
  shippingListTab: boolean = true;
  clientId: number= 0;
  clientName: string  = '';
  editMode: boolean = false;
  constructor(private messageService: MessageService, private customerService: CustomerService ) { }

  ngOnInit() {
  }

  openNew() {
    this.customerDialog = true;
    this.customerBasic = {};
    this.editMode= false;
  }

  hideDialog() {
    this.customerDialog = false;
    this.editBasic.submittedBasic = false;
  }

  editCustomer(customerBasic: CustomerBasicInfo) {
    this.customerDialog = true;
    this.customerBasic  = customerBasic;
    this.commercialInfoTab = false;
    this.buildingListTab = false;
    this.transporterListTab = false;
    this.shippingListTab = false;
    this.clientName = customerBasic.name as string;
    this.clientId = customerBasic.id as number;
    this.editMode= true;
  }

  getCommercialInfoByClient(clientId : number){
    this.customerService.getCommercialInfoByClient(clientId)
    .subscribe({
        next: (data:any) => {
          this.customerCommercialInfo = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
          console.log(error);
        }
    });
  }
  
  
  saveContentTabs(){
    if (this.feature.toLowerCase() === 'cliente'){
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
  }

  saveCustomerBasic()
  {
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGrouBasic.invalid) {
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
                    this.transporterListTab = false;
                    this.shippingListTab = false;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente Creado', life: 3000 });
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }

  saveCustomerCommercialInfo()
  {
    this.editCommercial.submittedCommercial = true;
    if (this.editCommercial.formGroupCommercial.invalid) {
      return;
    }
    let formValues  = this.editCommercial.f;
    let objCommercial: CustomerCommercialInfo = {
    customerId : this.clientId,
    priorityGroup: formValues.priorityGroupSelected?.value?.name,
    customerType: formValues.clientTypeSelected?.value?.name,
    iva: formValues.iva.value === '' ? 0 : formValues.iva.value ,
    assignedQuota: formValues.assignedQuota.value === '' ? 0 : formValues.assignedQuota.value ,
    usedQuota: formValues.usedQuota.value === '' ? 0 : formValues.usedQuota.value ,
    availableQuota: formValues.availableQuota.value === '' ? 0 : formValues.availableQuota.value ,
    maturityDays: formValues.maturityDays.value === '' ? 0 : formValues.maturityDays.value ,
    additionalDays: formValues.additionalDays.value === '' ? 0 : formValues.additionalDays.value ,
    delayDays: formValues.delayDays.value === '' ? 0 : formValues.delayDays.value ,
    intermediationPercentage: formValues.intermediationPercentage.value === '' ? 0 : formValues.intermediationPercentage.value,
    measureUnit: formValues.measureUnitSelected?.value?.name
    }
    this.customerService.postCustomerCommercial(objCommercial)
            .subscribe({
                next: (data) => {
                  if(data !== null)
                  {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente Creado', life: 3000 });
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }


  onChangeTab(event: any){
    console.log(event)
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
        }
        if (this.tabIndex === 2)
        {
          this.buildingList.getGridData();
        }
      }

    }
    if(this.feature === 'Transportador')
    {
      this.showOptions = event.index === 1 || event.index === 2 ? false: true;
    }
  }
}
