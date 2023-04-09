import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { params } from 'src/app/ui/models/param.model';
import { TransporterRoutes } from 'src/app/ui/models/transporter.model';
import { ParamService } from 'src/app/ui/service/param.service';
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
  origins: params[] = [];
  destinations: params[] = [];
  cols: any[] = [];
  
  constructor(
    private TransporterService: TransporterService,
    private paramService: ParamService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.getGridData();

    this.cols = [
        { field: 'RuoteName', header: 'Ruta' }
    ];
  
    this.formTransporterRoutes = this.formBuilder.group({
      originSelected: ['',[Validators.required]],
      destinationSelected: ['',[Validators.required]]
     });
 }

 openNewRoute()
 {
   this.transporterRouteDialog = true;
   this.getOriginsParams();
   this.getDestinationsParams();
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

getOriginsParams(){
  this.paramService.getParamByType('Origen')
          .subscribe({
              next: (data:any) => {
                this.origins = data;
              },
              error: error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                console.log(error);
              }
          });
}

getDestinationsParams(){
  this.paramService.getParamByType('Destino')
          .subscribe({
              next: (data:any) => {
                this.destinations = data;
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
    return;
  }

  let formValues  = this.f;
    let objTransporterRoutes: TransporterRoutes = {
      transporterId: this.transporterId,
      origin: formValues.originSelected.value,
      destination: formValues.destinationSelected.value,
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
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
 }


 deleteTransporterRoute ()
 {
  this.deleteTransporterRouteDialog = true;
 }

 confirmDeleteSelected()
 {
  this.TransporterService.deleteTransporterRoute(this.transporterId)
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
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          }
      });
 }

 get f() { return this.formTransporterRoutes?.controls; }
}
