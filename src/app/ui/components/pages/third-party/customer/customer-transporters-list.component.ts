import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerTransport } from 'src/app/ui/models/customer.model';
import { CustomerService } from 'src/app/ui/service/customer.service';

interface CustomerTransporters
{
  name: string
}

@Component({
  selector: 'app-customer-transporters-list',
  templateUrl: './customer-transporters-list.component.html',
  styleUrls: ['./customer-transporters-list.component.scss']
})
export class CustomerTransportersListComponent implements OnInit {
  //customerTransporters: CustomerTransporters[] = [];
  formCustomerTransporter!: FormGroup;
  customersTransporters: CustomerTransport[] = [];
  submittedCustomerTransporter: boolean = false;
  validateCustomerTransporter: boolean = false;
  customerTransporterDialog: boolean = false;
  deleteCustomerTransporterDialog: boolean = false;
  showVarCode = false;
  cols: any[] = [];
  action: string = "Relacionar";
  constructor(private customerService: CustomerService,private formBuilder: FormBuilder) { }

  ngOnInit() {

    /*this.customerTransporters = [
     { name: 'Transportador 1' },
     { name: 'Transportador 2' }
    ];*/

    this.customerService.getCustomerTransportersList().then(data => this.customersTransporters = data);

    this.cols = [
        { field: 'transportName', header: 'Nombre' },
        { field: 'status', header: 'Estado' }
    ];
  
    this.formCustomerTransporter = this.formBuilder.group({
      transporterSelected: ['',[Validators.required]],
      verificationCode: ['']
     });

 }

 openNewTransporter()
 {
   this.customerTransporterDialog = true;
   this.showVarCode = false;
   this.action = "Relacionar";
 }

 saveTransporterByClient()
 {
  this.submittedCustomerTransporter = true;
  if(!this.formCustomerTransporter.invalid)
  {
    this.showVarCode = true;
    this.action = "Autorizar";
  }
 }

 validateTransporterByClient()
 {
  this.validateCustomerTransporter = true;
  if (this.validateCustomerTransporter)
  {
    this.f["verificationCode"].setValidators(Validators.required);
    this.formCustomerTransporter.get("verificationCode")?.updateValueAndValidity();
  }
  /*if(!this.formCustomerTransporter.invalid)
  {
    this.showVarCode = true;
    this.action = "Autorizar";
  }*/
 }

 deleteCustomerTransporter ()
 {
  this.deleteCustomerTransporterDialog = true;
 }

 confirmDeleteSelected()
 {
  
 }

 get f() { return this.formCustomerTransporter?.controls; }

}
