import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';
import { material } from 'src/app/ui/models/material.model';
import { providerOrder } from 'src/app/ui/models/order.model';
import { ProviderBasicInfo } from 'src/app/ui/models/provider.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { MaterialService } from 'src/app/ui/service/material.service';
import { ProviderService } from 'src/app/ui/service/provider.service';

@Component({
  selector: 'app-provider-order-edit',
  templateUrl: './provider-order-edit.component.html',
  styleUrls: ['./provider-order-edit.component.scss']
})
export class ProviderOrderEditComponent implements OnInit {
  @Input() providerOrderEdit!: providerOrder;

  customers: CustomerBasicInfo[] = []
  providers: ProviderBasicInfo[] = [];
  customersBuildings: any[] = [];
  materials: material[] = [];
  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  clientID : number = 0;
  clientIDSelected: number = 0;
  today = new Date();
  totalAmountDisabled: boolean = true
  total = 0;
  isEdit: boolean = false;
  currentDate: Date = new Date();
  constructor(private formBuilder: FormBuilder,
    private materialService: MaterialService,
    private providerService: ProviderService,
    private customerService: CustomerService, 
    private messageService: MessageService) { 
  }

  ngOnInit(): void {
    this.getCustomerList();
    this.getProviderList();
    this.getMaterials();
  
    if (Object.keys(this.providerOrderEdit).length === 0){
    this.isEdit = false;
    this.formGroupBasic = this.formBuilder.group({
      providerSelected: ['',[Validators.required]],
      clientSelected: ['',[Validators.required]],
      shippingDateSelected: ['',[Validators.required]],
      buildingSelected: ['', [Validators.required]],
      materialSelected: ['', [Validators.required]],
      amount: [1,[Validators.required]],
      stateSelected:[true]
    });
    }else
    {
      let disableControl: boolean = false;
      this.isEdit = true;
      this.formGroupBasic = this.formBuilder.group({
      providerSelected: [{value : this.providerOrderEdit.providerId, disabled : disableControl }, [Validators.required]],
      clientSelected: [{value : this.providerOrderEdit.clientName, disabled : disableControl }, [Validators.required]],
      shippingDateSelected: [{value : new Date(this.providerOrderEdit.shipmentDate as Date), disabled : disableControl }, [Validators.required]],
      buildingSelected: [{value : this.providerOrderEdit.buildingId, disabled : disableControl}, [Validators.required]],
      materialSelected: [{value:  this.providerOrderEdit.materialId, disabled : disableControl}, [Validators.required]],
      amount: [{value: this.providerOrderEdit.amount, disabled: disableControl},  [Validators.required]],
      stateSelected:[{value: this.providerOrderEdit.state === 'Activo' ? true: false}]
      });
    }
  }

  getProviderList(){
    this.providerService.getProvider()
    .subscribe({
        next: (data:any) => {
          this.providers = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  getCustomerList(){
    this.customerService.getCustomerBasic()
    .subscribe({
        next: (data:any) => {
          this.customers = data;
          if (Object.keys(this.providerOrderEdit).length !== 0){
            let idClient = this.getClientId(this.customers, this.providerOrderEdit.clientName) as number;
            this.f.clientSelected.setValue(idClient);
            this.getBuildingsByClient(idClient);
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  getClientId(data: CustomerBasicInfo[], name: any){
    return data.find(x=> x.name === name)?.id
  }

  getBuildingsByClient(clientId: number){
    this.customerService.getBuildingsByClient(clientId)
    .subscribe({
        next: (data:any) => {
          this.customersBuildings = data;
          if (Object.keys(this.providerOrderEdit).length !== 0){
            this.f.buildingSelected.setValue(this.providerOrderEdit.buildingId);
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  changeClient(event: any){
    this.clientID = event.value as number;
    this.getBuildingsByClient(this.clientID);  
  }

  getMaterials(){
    this.materialService.getMaterial()
    .subscribe({
        next: (data:any) => {
          this.materials = data;
        },
        error: (error: { message: any; }) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  get f() { return this.formGroupBasic?.controls; }
}
