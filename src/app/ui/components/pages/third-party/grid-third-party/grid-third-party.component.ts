import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';

@Component({
  selector: 'app-grid-third-party',
  templateUrl: './grid-third-party.component.html',
  styleUrls: ['./grid-third-party.component.scss']
})
export class GridThirdPartyComponent {
  @Input()title!: string;
  @Input()feature!: string;
  @Input()listGrid: any[] = [];
  customers: CustomerBasicInfo[] = [];
  cols: any[] = [];
  customerDialog: boolean = false;
  showOptions: boolean = true;
  commercialInfoTab: boolean = true;
  buildingListTab: boolean = true;
  transporterListTab: boolean = true;
  shippingListTab: boolean = true;
  constructor(private messageService: MessageService) { }

  openNew() {
    //this.customerBasic = {};
    //this.editBasic.submittedBasic = false;
    //this.submittedCommercial = false;
    this.customerDialog = true;
  }

  hideDialog() {
    this.customerDialog = false;
    //this.editBasic.submittedBasic = false;
    //this.submittedCommercial = false;
  }
  
  saveCustomerBasic(){
    /*this.editBasic.submittedBasic = true;
    console.log(this.editBasic.formGrouBasic)
    console.log(this.editCommercial.formGroupCommercial)
    //this.submittedCommercial = true;
    this.commercialInfoTab = false;
    this.buildingListTab = false;
    this.transporterListTab = false;
    this.transporterListTab = false;
    this.shippingListTab = false;
    this.editCommercial.submittedCommercial = true;*/
  }
  onChangeTab(event: any){
    console.log(event)
    this.showOptions = event.index === 2 || event.index === 3 || event.index === 4 ? false: true;
  }
}
