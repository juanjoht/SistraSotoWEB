import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerCommercialInfo } from 'src/app/ui/models/customer.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { CustomerBasicEditComponent } from './customer-basic-edit.component';
import { CustomerCommercialEditComponent } from './customer-commercial-edit.component';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styles: [''],
  providers: [MessageService]
})
export class CustomerComponent implements OnInit {
  @ViewChild(CustomerBasicEditComponent)editBasic!: CustomerBasicEditComponent;
  @ViewChild(CustomerCommercialEditComponent)editCommercial!: CustomerCommercialEditComponent;
  customers: CustomerBasicInfo[] = [];
  cols: any[] = [];
  customerDialog: boolean = false;
  commercialInfoTab: boolean = true;
  buildingListTab: boolean = true;
  transporterListTab: boolean = true;
  shippingListTab: boolean = true;
  showOptions: boolean = true;
  constructor(private customerService: CustomerService, private messageService: MessageService) { }


  ngOnInit() {
    this.customerService.getCustomersList().then(data => this.customers = data);

    this.cols = [
        { field: 'docNumber', header: 'Número documento' },
        { field: 'name', header: 'Nombre' },
        { field: 'phone', header: 'Teléfono' },
        { field: 'isActive', header: 'Estado' }
    ];
  }

  openNew() {
    //this.customerBasic = {};
    //this.editBasic.submittedBasic = false;
    //this.submittedCommercial = false;
    this.customerDialog = true;
  }

  hideDialog() {
    this.customerDialog = false;
    this.editBasic.submittedBasic = false;
    //this.submittedCommercial = false;
  }

  saveCustomerBasic(){
    this.editBasic.submittedBasic = true;
    console.log(this.editBasic.formGrouBasic)
    console.log(this.editCommercial.formGroupCommercial)
    //this.submittedCommercial = true;
    this.commercialInfoTab = false;
    this.buildingListTab = false;
    this.transporterListTab = false;
    this.transporterListTab = false;
    this.shippingListTab = false;
    this.editCommercial.submittedCommercial = true;
  }

  onChangeTab(event: any){
    console.log(event)
    this.showOptions = event.index === 2 || event.index === 3 || event.index === 4 ? false: true;
  }


}
