import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { params } from 'src/app/ui/models/param.model';
import { route } from 'src/app/ui/models/route.model';
import { TransporterRoutes } from 'src/app/ui/models/transporter.model';
import { ParamService } from 'src/app/ui/service/param.service';
import { RouteService } from 'src/app/ui/service/route.service';
import { TransporterService } from 'src/app/ui/service/transporter.service';

@Component({
  selector: 'app-transporter-route-list',
  templateUrl: './transporter-route-list.component.html',
  styleUrls: ['./transporter-route-list.component.scss']
})
export class TransporterRouteListComponent {
  @Input() transporterName: string = '';
  @Input() transporterId: number = 0;
  @Input() viewMode: boolean = false;

  formTransporterRoutes!: FormGroup;
  transporterRoutes: TransporterRoutes[] = [];
  submittedTransporterRoute: boolean = false;
  transporterRouteDialog: boolean = false;
  deleteTransporterRouteDialog: boolean = false;
  routes: route[] = [];
  cols: any[] = [];
  routeID: number = 0
  constructor(
    private TransporterService: TransporterService,
    private RouteService: RouteService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.getGridData();

    this.cols = [
        { field: 'RuoteName', header: 'Ruta' }
    ];
  
    this.formTransporterRoutes = this.formBuilder.group({
      routeSelected: ['',[Validators.required]]
     });
 }

 openNewRoute()
 {
   this.transporterRouteDialog = true;
   this.getRouteList();
   this.formTransporterRoutes.reset();
   this.submittedTransporterRoute= false;
 }

 getGridData(){
  this.TransporterService.getTransporterRoutes(this.transporterId)
  .subscribe({
      next: (data:any) => {
        this.transporterRoutes = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 });
        console.log(error);
      }
  });
}

getRouteList(){
  this.RouteService.getRoutesList()
  .subscribe({
      next: (data:any) => {
        this.routes = data;
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        console.log(error);
      }
  });
}

 saveTransporterByClient()
 {
  this.submittedTransporterRoute = true;
  if(this.formTransporterRoutes.invalid)
  {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe diligenciar todos los campos obligatorios.', life: 5000 });
    return;
  }

  let formValues  = this.f;
    let objTransporterRoutes: TransporterRoutes = {
      transporterId: this.transporterId,
      routeId: formValues.routeSelected.value,
    }
      this.TransporterService.postTransporterRoute(objTransporterRoutes)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.transporterRouteDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ruta Cubierta por el Transportador Creada', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
 }


 deleteTransporterRoute(routeId: number)
 {
  this.deleteTransporterRouteDialog = true;
  this.routeID = routeId;
 }

 confirmDeleteSelected()
 {
  this.TransporterService.deleteTransporterRoute(this.routeID,this.transporterId)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              this.deleteTransporterRouteDialog = false;
              this.getGridData();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Ruta Cubierta por el Transportador Eliminada', life: 3000 });
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.message, life: 5000 });
          }
      });
 }

 get f() { return this.formTransporterRoutes?.controls; }
}
