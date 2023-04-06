import { Component, OnInit } from '@angular/core';
import { CustomerShipping } from 'src/app/ui/models/customer.model';
import { CustomerService } from 'src/app/ui/service/customer.service';

@Component({
  selector: 'app-customer-shipping-list',
  templateUrl: './customer-shipping-list.component.html',
  styleUrls: ['./customer-shipping-list.component.scss']
})
export class CustomerShippingListComponent implements OnInit {
  customersShippingRate: CustomerShipping[] = [];
  customerShippingRateDialog: boolean = false;
  cols: any[] = [];
  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.getCustomerShippingList().then(data => this.customersShippingRate = data);

    this.cols = [
        { field: 'origin', header: 'Origen' },
        { field: 'destination', header: 'Destino' },
        { field: 'material', header: 'Material' },
        { field: 'measureUnit', header: 'm3/ton' },
        { field: 'shippingValue', header: 'Valor Flete' }
    ];
  }

  openNewShippingRate()
  {
    this.customerShippingRateDialog = true;
  }


}
