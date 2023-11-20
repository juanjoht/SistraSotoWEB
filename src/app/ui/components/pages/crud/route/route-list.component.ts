import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { route } from 'src/app/ui/models/route.model';
import { RouteService } from 'src/app/ui/service/route.service';
import { RouteEditComponent } from './route-edit.component';
import { Common } from 'src/app/common/common';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
  providers: [MessageService]
})
export class RouteListComponent implements OnInit {
  @ViewChild(RouteEditComponent)editBasic!: RouteEditComponent;
  Routes: route[] = [];
  Route : route = {};
  cols: any[] = [];
  RouteEditTab: boolean = true;
  RouteDialog = false;
  showOptions: boolean = true;
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;
  tabIndex: number = 0;
  editMode: boolean = false;
  isViewMode: boolean = false;
  RouteId: number= 0;
  RouteName: string  = '';

  constructor(private RouteService: RouteService, private messageService: MessageService) { }

  ngOnInit() {
    this.canRead = Common.checkPermissions('Maestros-Rutas', 'Consultar');
    this.canCreate = Common.checkPermissions('Maestros-Rutas', 'Crear');
    this.canEdit = Common.checkPermissions('Maestros-Rutas', 'Editar');
    this.getGridData();

    this.cols = [
        { field: 'name', header: 'Ruta' },
        { field: 'origin', header: 'Origen' },
        { field: 'destination', header: 'Destino' },
        { field: 'state', header: 'Estado' }
    ];
  }

  getGridData(){
    this.RouteService.getRoutes()
    .subscribe({
        next: (data:any) => {
          this.Routes = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  openNew(){
    this.RouteDialog = true;
    this.editMode= false;
    this.Route = {};
    this.showOptions = true;
  }

  editRoute(routeObj: any, isviewMode: boolean = false) {
    this.editMode= true;
    this.RouteId = routeObj.id as number;
    this.RouteName = routeObj.name;
    this.RouteDialog = true;
    this.Route = routeObj;
    this.isViewMode = isviewMode;
    this.showOptions = !isviewMode;
  }


  saveRoute(){
    this.editBasic.submittedBasic = true;
    if (this.editBasic.formGroupBasic.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
      return;
    }
    let formValues  = this.editBasic.f;
    let clientNameOrigin  = this.editBasic.customersOrigin.find(x=> x.id === formValues.originClientSelected.value)?.name
    let clientNameDestination  = this.editBasic.customersDestination.find(x=> x.id === formValues.destinationClientSelected.value)?.name
    let objBasic: route = {
      name: formValues.name.value,
      runningTime: formValues.runningTime.value,
      originType: formValues.originTypeSelected.value,
      originClient: clientNameOrigin,
      origin: formValues.originSelected.value,
      destinationType: formValues.destinationTypeSelected.value,
      destinationClient: clientNameDestination,
      destination: formValues.destinationSelected.value,
      state : (formValues.stateSelected.value) ? 'Activo' : 'Inactivo'
    }
    if (this.editMode){
      objBasic.id = this.RouteId;
      this.RouteService.putRoute(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.RouteDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ruta Actualizada', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }else{
      this.RouteService.postRoute(objBasic)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.RouteDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ruta Creado', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }
  }

  hideDialog(){
    this.RouteDialog = false;
    this.editBasic.submittedBasic = false;
  }
}
