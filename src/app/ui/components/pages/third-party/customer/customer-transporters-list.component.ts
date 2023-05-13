import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerTransport } from 'src/app/ui/models/customer.model';
import { TransporterBasicInfo } from 'src/app/ui/models/transporter.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { TransporterService } from 'src/app/ui/service/transporter.service';

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
  @Input() clientName: string = '';
  @Input() clientId: number = 0;
  @Input() viewMode: boolean = false;
  formCustomerTransporter!: FormGroup;
  customersTransporters: CustomerTransport[] = [];
  Transporters: TransporterBasicInfo[] = [];
  submittedCustomerTransporter: boolean = false;
  validateCustomerTransporter: boolean = false;
  customerTransporterDialog: boolean = false;
  deleteCustomerTransporterDialog: boolean = false;
  showVarCode = false;
  cols: any[] = [];
  action: string = "Relacionar";
  transporterId: number = 0;
  constructor(
    private customerService: CustomerService,
    private transporterService: TransporterService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.getGridData();

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
  this.getAllTransportersData();
   this.customerTransporterDialog = true;
   this.showVarCode = false;
   this.action = "Relacionar";
   this.formCustomerTransporter.reset();
   this.formCustomerTransporter.get("verificationCode")?.removeValidators(Validators.required);
   this.formCustomerTransporter.updateValueAndValidity();
 }

 getGridData(){
  this.customerService.getTransportersByClient(this.clientId)
  .subscribe({
      next: (data:any) => {
        this.customersTransporters = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.details, life: 5000 });
      }
  });
}

getAllTransportersData(){
  this.transporterService.getTransporter()
  .subscribe({
      next: (data:any) => {
        this.Transporters = data;
      },
      error: (error: { message: any; }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
      }
  });
}

 saveTransporterByClient()
 {
  this.submittedCustomerTransporter = true;
  if (this.formCustomerTransporter.invalid) {
    return;
  }
    let formValues  = this.f;
    let objCustomerTransporter: CustomerTransport = {
      customerId: this.clientId,
      transportId: formValues.transporterSelected.value
    }
    this.customerService.postLinkCustomerTransporter(objCustomerTransporter)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      this.showVarCode = true;
                      this.action = "Autorizar";
                      this.getGridData();
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Relación Transportador Cliente Creada', life: 3000 });
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                    console.log(error);
                  }
              });
 }

 authorizeTransporter()
 {
    let formValues  = this.f;
    let objCustomerTransporter: CustomerTransport = {
      customerId: this.clientId,
      transportId: formValues.transporterSelected.value,
      codeAuth : formValues.verificationCode.value
    }
    
    this.customerService.postAuthorizeTransporter(objCustomerTransporter)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      if(data)
                      {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Transportador Autorizado', life: 3000 });
                        this.customerTransporterDialog = false; 
                        this.getGridData();
                      }else
                      {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo autorizar el transportador, verifique que el código sea el correcto', life: 3000 });
                      }
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                    console.log(error);
                  }
              });
 }

 validateTransporterByClient()
 {
  this.f["verificationCode"].setValidators(Validators.required);
  this.formCustomerTransporter.get("verificationCode")?.updateValueAndValidity();
  if(!this.formCustomerTransporter.invalid)
  {
    this.authorizeTransporter();
  }
 }

 deleteCustomerTransporter (transporterid: number)
 {
  this.deleteCustomerTransporterDialog = true;
  this.transporterId = transporterid;
 }

 confirmDeleteSelected()
 {

  this.customerService.deleteTransporterClient(this.clientId,this.transporterId)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      if(data)
                      {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Transportador Eliminado', life: 3000 });
                        this.deleteCustomerTransporterDialog = false; 
                        this.getGridData();
                      }else
                      {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el transportador', life: 3000 });
                      }
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                    console.log(error);
                  }
              });
  
 }

 sendCodeAgain(idTransporter: number)
 {
  this.formCustomerTransporter.reset();
  this.submittedCustomerTransporter = false;
  this.formCustomerTransporter.get("transporterSelected")?.setValue(idTransporter);
    let objCustomerTransporter: CustomerTransport = {
      customerId: this.clientId,
      transportId: idTransporter
    }
    this.customerService.sendTransporterCode(objCustomerTransporter)
              .subscribe({
                  next: (data) => {
                    if(data !== null)
                    {
                      if(data)
                      {
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Código de Validación Enviado', life: 3000 });
                        this.customerTransporterDialog = true;
                        this.showVarCode = true;
                        this.action = "Autorizar";
                      }else
                      {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar código de validación al cliente', life: 3000 });
                      }
                    }
                  },
                  error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                    console.log(error);
                  }
              });
 }

 get f() { return this.formCustomerTransporter?.controls; }

}
