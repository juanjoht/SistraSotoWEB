import { Component, OnInit } from '@angular/core';
import { CustomerBuildings } from 'src/app/ui/models/customer.model';
import { CustomerService } from 'src/app/ui/service/customer.service';

@Component({
  selector: 'app-customer-buildings-list',
  templateUrl: './customer-buildings-list.component.html',
  styleUrls: ['./customer-buildings-list.component.scss']
})
export class CustomerBuildingsListComponent implements OnInit {
  customersBuildings: CustomerBuildings[] = [];
  customerBuildingDialog: boolean = false;
  cols: any[] = [];
  constructor(private customerService: CustomerService) { }
  
  ngOnInit() {
    this.customerService.getCustomerBuildingsList().then(data => this.customersBuildings = data);

    this.cols = [
        { field: 'name', header: 'Nombre' },
        { field: 'city', header: 'Municipio' },
        { field: 'address', header: 'Dirección' },
        { field: 'isActive', header: 'Estado' }
    ];
  }

  openNewBuilding()
  {
    this.customerBuildingDialog = true;
  }
}
