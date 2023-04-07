import { Component, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';
import { CustomerBasicEditComponent } from '../customer/customer-basic-edit.component';
import { CustomerService } from 'src/app/ui/service/customer.service';

@Component({
  selector: 'app-grid-third-party',
  templateUrl: './grid-third-party.component.html',
  styleUrls: ['./grid-third-party.component.scss']
})
export class GridThirdPartyComponent {
  @Input()title!: string;
  @Input()feature!: string;
  @Input()listGrid: any[] = [];
  @ViewChild(CustomerBasicEditComponent)editBasic!: CustomerBasicEditComponent;
  //@ViewChild(CustomerCommercialEditComponent)editCommercial!: CustomerCommercialEditComponent;
  tabIndex: number = 0;
  customers: CustomerBasicInfo[] = [];
  cols: any[] = [];
  customerDialog: boolean = false;
  showOptions: boolean = true;
  commercialInfoTab: boolean = true;
  buildingListTab: boolean = true;
  transporterListTab: boolean = true;
  shippingListTab: boolean = true;
  constructor(private messageService: MessageService, private customerService: CustomerService ) { }

  openNew() {
    this.customerDialog = true;
  }

  hideDialog() {
    this.customerDialog = false;
    this.editBasic.submittedBasic = false;
  }
  
  saveCustomerTabs(){
    switch (this.tabIndex) {
      case 0:
        if (this.feature.toLowerCase() === 'cliente'){
          this.saveCustomerBasic();
        }
        break;
    
      default:
        break;
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
    docType: formValues.documentTypeSelected?.value?.name,
    docNumber: formValues.docNumber.value,
    name: formValues.name.value,
    phone: formValues.phone.value,
    cellPhone: formValues.cellphone.value,
    email: formValues.email.value,
    dept: formValues.deptSelected?.value?.name,
    city: formValues.citySelected?.value?.name,
    address: formValues.address.value
    }
    this.customerService.postCustomerBasic(objBasic)
            .subscribe({
                next: (data) => {
                  console.log(data);
                  this.commercialInfoTab = false;
                  this.buildingListTab = false;
                  this.transporterListTab = false;
                  this.transporterListTab = false;
                  this.shippingListTab = false;
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente Creado', life: 3000 });
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
    }
    if(this.feature === 'Transportador')
    {
      this.showOptions = event.index === 1 ? false: true;
    }
  }
}
