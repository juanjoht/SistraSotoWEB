import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerCommercialInfo } from 'src/app/ui/models/customer.model';
import { CustomerService } from 'src/app/ui/service/customer.service';

interface DocTypes {
  name: string;
}
interface Depts {
  name: string;
}
interface Cities {
  name: string;
}
interface PriorityGroups {
  name: string;
}
interface ClientTypes {
  name: string;
}
interface measureUnits {
  name: string;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  providers: [MessageService]
})
export class CustomerComponent implements OnInit {
  customers: CustomerBasicInfo[] = [];
  customerBasic: CustomerBasicInfo = {};
  customerCommercial: CustomerCommercialInfo = {};
  cols: any[] = [];
  submittedBasic: boolean = false;
  submittedCommercial: boolean = false;
  customerDialog: boolean = false;
  documentTypes: DocTypes[] = [];
  documentTypeSelected!: DocTypes;
  depts: Depts[] = [];
  deptSelected!: Depts;
  cities: Cities[] = [];
  citySelected!: Cities;
  commercialInfoTab: boolean = true;
  priorityGroups: PriorityGroups[] = [];
  priorityGroupSelected!: PriorityGroups;
  clientTypes: ClientTypes[] = [];
  clientTypeSelected!: ClientTypes;
  measureUnits: measureUnits[] = [];
  measureUnitSelected!: measureUnits;
  constructor(private customerService: CustomerService, private messageService: MessageService) { }


  ngOnInit() {
    this.customerService.getCustomersList().then(data => this.customers = data);

    this.cols = [
        { field: 'docNumber', header: 'Número documento' },
        { field: 'name', header: 'Nombre' },
        { field: 'phone', header: 'Teléfono' },
        { field: 'isActive', header: 'Estado' }
    ];
    this.documentTypes = [
      { name: 'CC' },
      { name: 'CE' },
      { name: 'Passaporte' }
     ];
     this.depts = [
      { name: 'Antioquia' },
      { name: 'Cundinamarca' },
      { name: 'Atlantico' }
     ];
     this.cities = [
      { name: 'Medellin' },
      { name: 'Itagui' },
      { name: 'Envigado' }
     ];
     this.priorityGroups = [
      { name: '1' },
      { name: '2' },
      { name: '3' }
     ];
     this.clientTypes = [
      { name: 'Crédito' },
      { name: 'Contado' }
     ];
     this.measureUnits = [
      { name: 'm3' },
      { name: 'ton' }
     ];
  }

  openNew() {
    this.customerBasic = {};
    this.submittedBasic = false;
    this.submittedCommercial = false;
    this.customerDialog = true;
  }

  hideDialog() {
    this.customerDialog = false;
    this.submittedBasic = false;
    this.submittedCommercial = false;
  }

  saveCustomerBasic(){
    this.submittedBasic = true;
    //this.submittedCommercial = true;
    this.commercialInfoTab = false;
  }


}
