import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RateTransportEditComponent } from './rate-transport-edit.component';
import { RateTransport } from 'src/app/ui/models/rate-transport.model';
import { RateTransportService } from 'src/app/ui/service/rate-transport.service';
import { Common } from 'src/app/common/common';

@Component({
  selector: 'app-rate-transport-list',
  templateUrl: './rate-transport-list.component.html',
  styleUrls: ['./rate-transport-list.component.scss'],
  providers: [MessageService]
})
export class RateTransportListComponent implements OnInit {
    @ViewChild(RateTransportEditComponent)editBasic!: RateTransportEditComponent;
    ratesTransport: RateTransport[] = [];
    rate : RateTransport = {};
    cols: any[] = [];
    rateDialog = false;
    showOptions: boolean = true;
    canRead: boolean = true;
    canCreate: boolean = true;
    canEdit: boolean = true;
    editMode: boolean = false;
    isViewMode: boolean = false;
    rateTransportId: number= 0;
    rateTransportName: string  = '';
  
    constructor(private rateTransportService: RateTransportService, private messageService: MessageService) { }
  
    ngOnInit() {
      this.canRead = Common.checkPermissions('Maestros-Tarifas-Transporte', 'Consultar');
      this.canCreate = Common.checkPermissions('Maestros-Tarifas-Transporte', 'Crear');
      this.canEdit = Common.checkPermissions('Maestros-Tarifas-Transporte', 'Editar');
      this.getGridData();
      this.cols = [
          { field: 'routaName', header: 'Ruta' },
          { field: 'valueM3', header: 'Precio Venta m3' },
          { field: 'valueTon', header: 'Precio Venta ton' },
          { field: 'valueMinM3', header: 'Valor Min m3' },
          { field: 'valueMaxM3', header: 'Valor Max m3' },
          { field: 'valueMinTon', header: 'Valor Min ton' },
          { field: 'valueMaxTon', header: 'Valor Max ton' },
          { field: 'state', header: 'Estado' }
      ];
    }
  
    getGridData(){
      this.rateTransportService.getRates()
      .subscribe({
          next: (data:any) => {
            this.ratesTransport = data;
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
            console.log(error);
          }
      });
    }
  
    openNew(){
      this.rateDialog = true;
      this.editMode= false;
      this.rate = {};
      this.showOptions = true;
    }
  
    editRate(rateBasic: any, isviewMode: boolean = false) {
      this.editMode= true;
      this.rateTransportId = rateBasic.id as number;
      this.rateTransportName = rateBasic.name;
      this.rateDialog = true;
      this.rate = rateBasic;
      this.isViewMode = isviewMode;
      this.showOptions = !isviewMode;
    }
  
  
    saveRate(){
      this.editBasic.submittedBasic = true;
      if (this.editBasic.formGroupBasic.invalid) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
        return;
      }
      let formValues  = this.editBasic.f;
      let objBasic: RateTransport = {
        routeId: formValues.routeSelected.value,
        valueM3: formValues.valuem3.value,
        valueTon: formValues.valueton.value,
        valueMinM3: formValues.valueMinm3.value,
        valueMaxM3: formValues.valueMaxm3.value,
        valueMinTon: formValues.valueMinTon.value,
        valueMaxTon: formValues.valueMaxton.value,
        state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
      }
      if (this.editMode){
        objBasic.id = this.rateTransportId;
        this.rateTransportService.putRate(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.rateDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tarifa de Transporte Actualizada', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
      }else{
        this.rateTransportService.postRate(objBasic)
        .subscribe({
            next: (data) => {
              if(data !== null)
              {
                this.rateDialog = false;
                this.getGridData();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tarifa de Transporte Creada', life: 3000 });
              }
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            }
        });
      }
    }
  
    hideDialog(){
      this.rateDialog = false;
      this.editBasic.submittedBasic = false;
    }
}
