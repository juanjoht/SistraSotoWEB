import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { material } from 'src/app/ui/models/material.model';
import { ProviderPrices } from 'src/app/ui/models/provider.model';
import { MaterialService } from 'src/app/ui/service/material.service';
import { ProviderService } from 'src/app/ui/service/provider.service';

@Component({
  selector: 'app-provider-prices',
  templateUrl: './provider-prices.component.html',
  styleUrls: ['./provider-prices.component.scss']
})
export class ProviderPricesComponent implements OnInit {
  @Input() providerName: string = '';
  @Input() providerId: number = 0;
  @Input() viewMode: boolean = false;
  formProviderPrice!: FormGroup;
  providerPrices: ProviderPrices[] = [];
  providerPrice: ProviderPrices = {};
  materials: material[] = [];
  submittedProviderPrices: boolean = false;
  providerPriceDialog: boolean = false;
  editMode: boolean = false;
  providerPriceId: number = 0;
  cols: any[] = [];
  constructor(
    private materialService: MaterialService,
    private providerService: ProviderService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

    ngOnInit() {
      this.getGridData();
      this.cols = [
        { field: 'material', header: 'Material' },
        { field: 'valueM3', header: 'Valor M3' },
        { field: 'valueTon', header: 'Valor ton' },
        { field: 'state', header: 'Estado' }
    ];
      this.formProviderPrice = this.formBuilder.group({
        materialSelected: ['',[Validators.required]],
        valueM3: [0,[Validators.required]],
        valueTon: [0,[Validators.required]],
        stateSelected: [false]
       });
  
   }

   getGridData(){
    this.providerService.getProviderPrices(this.providerId)
    .subscribe({
        next: (data:any) => {
          this.providerPrices = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
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

  openNewPrice()
  {
   this.getMaterials();
    this.providerPriceDialog = true;
    this.submittedProviderPrices = false;
    this.formProviderPrice.reset();
  }
  

  editProviderPrice(providerPrice: ProviderPrices) {
    this.providerPriceDialog = true;
    this.editMode = true;
    this.providerPrice  = providerPrice;
    this.providerPriceId = providerPrice.id as number;
  }

  savePrices()
  {
   this.submittedProviderPrices = true;
   if (this.formProviderPrice.invalid) {
     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
     return;
   }
     let formValues  = this.f;
     let objProviderPrice: ProviderPrices = {
       providerId: this.providerId,
       material: formValues.materialSelected.value,
       valueM3: formValues.valueM3.value,
       valueTon: formValues.valueTon.value,
       state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
     }
     if (this.editMode){
      objProviderPrice.id = this.providerId;
      this.providerService.putProviderPrice(objProviderPrice)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.getGridData();
              this.providerPriceDialog = false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Precios Material Actualizados', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }else{
     this.providerService.postProviderPrice(objProviderPrice)
               .subscribe({
                   next: (data) => {
                     if(data !== null)
                     {
                       this.getGridData();
                       this.providerPriceDialog = false;
                       this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Precios Material Creados', life: 3000 });
                     }
                   },
                   error: error => {
                     this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
                   }
               });
              }
  }


  get f() { return this.formProviderPrice?.controls; }
}
