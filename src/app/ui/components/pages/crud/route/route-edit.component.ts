import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerBuildings } from 'src/app/ui/models/customer.model';
import { route, routeType } from 'src/app/ui/models/route.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { ParamService } from 'src/app/ui/service/param.service';
import { RouteService } from 'src/app/ui/service/route.service';

@Component({
  selector: 'app-route-edit',
  templateUrl: './route-edit.component.html',
  styleUrls: ['./route-edit.component.scss']
})
export class RouteEditComponent implements OnInit {
  @Input() routelEdit!: route;
  @Input() viewMode: boolean = false;

  customers: CustomerBasicInfo[] = []
  customersBuildingsOrigin: any[] = [];
  customersBuildingsDestination: any[] = [];
  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  locations: CustomerBasicInfo[] = []
  clientID : number = 0;
  clientIDSelected: number = 0;
  constructor(private formBuilder: FormBuilder,
      private paramService: ParamService,
      private RouteService: RouteService,
      private customerService: CustomerService, 
      private messageService: MessageService) { }

  types : routeType[] = [
    {
      id : 1,
      name : 'Obra'
    },
    {
      id : 2,
      name : 'Ubicación'
    }
  ]

  ngOnInit(): void {
    this.getCustomerList();
    if (Object.keys(this.routelEdit).length === 0){
    this.formGroupBasic = this.formBuilder.group({
      name: ['',[Validators.required]],
      originTypeSelected: ['', [Validators.required]],
      originClientSelected: ['', [Validators.required]],
      originSelected: ['', [Validators.required]],
      destinationTypeSelected: ['', [Validators.required]],
      destinationClientSelected: ['', [Validators.required]],
      destinationSelected: ['', [Validators.required]],
      stateSelected:[true]
     });
    }else
    {
      this.formGroupBasic = this.formBuilder.group({
        name: [{value: this.routelEdit.name , disabled: this.viewMode},[Validators.required]],
        originTypeSelected: [{value:this.routelEdit.originType, disabled: this.viewMode}, [Validators.required]],
        originClientSelected: [{value:'', disabled: this.viewMode}, [Validators.required]],
        originSelected: [{value:this.routelEdit.origin, disabled: this.viewMode}, [Validators.required]],
        destinationTypeSelected: [{value: this.routelEdit.destinationType, disabled: this.viewMode}, [Validators.required]],
        destinationClientSelected : [{value: '', disabled: this.viewMode}, [Validators.required]],
        destinationSelected:[{value: this.routelEdit.destination, disabled: this.viewMode},[Validators.required]],
        stateSelected:[{value: this.routelEdit.state === 'Activo' ? true: false, disabled: this.viewMode}]
       });
    }
  }

  getCustomerList(){
    this.customerService.getCustomerBasic()
    .subscribe({
        next: (data:any) => {
          this.customers = data;
          if (Object.keys(this.routelEdit).length !== 0){
            let clientIDOriginSelected = this.getClientId(this.customers, this.routelEdit.originClient?.toString()) as number
            this.f.originClientSelected.setValue(clientIDOriginSelected);
            if(this.routelEdit.originType === 'Obra'){
               this.getBuildingsByClient(clientIDOriginSelected,'origin');
            }
            let clientIDDestinationSelected = this.getClientId(this.customers, this.routelEdit.originClient?.toString()) as number
            this.f.destinationClientSelected.setValue(clientIDDestinationSelected);
            if(this.routelEdit.destinationType === 'Obra'){
              this.getBuildingsByClient(clientIDDestinationSelected,'destination');
            }
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  getClientId(data: CustomerBasicInfo[], name: any){
    return data.find(x=> x.name === name)?.id
  }

  getBuildingsByClient(clientId: number,type: string){
    this.customerService.getBuildingsByClient(clientId)
    .subscribe({
        next: (data:any) => {
          if(type === 'origin'){
            this.customersBuildingsOrigin = data;
          }else{
            this.customersBuildingsDestination = data;
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
        }
    });
  }

  getLocations(type: string){
    this.paramService.getParamByType('Ubicaciones')
            .subscribe({
                next: (data:any) => {
                  if(type === 'origin'){
                    this.customersBuildingsOrigin = data;
                  }else{
                    this.customersBuildingsDestination = data;
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });                  
                }
            });
  }

  changeClient(event: any, type: string)
  {
    this.clientID = event.value as number;
    if(type === 'origin'){
      if(this.f?.originTypeSelected.value === 'Obra'){
        this.getBuildingsByClient(this.clientID,type);
      }
    }else
    {
      if(this.f?.destinationTypeSelected.value === 'Obra'){
        this.getBuildingsByClient(this.clientID,type);
      }
    }
   
  }

  changeType(event: any,type: string)
  {
    if(type === 'origin'){
      if(this.f?.originTypeSelected.value === 'Obra'){
        this.getBuildingsByClient(this.clientID,type);
      }else
      {
        this.getLocations(type);
      }
    }else
    {
      if(this.f?.destinationTypeSelected.value === 'Obra'){
        this.getBuildingsByClient(this.clientID,type);
      }else
      {
        this.getLocations(type);
      }
    }
  }

  


  get f() { return this.formGroupBasic?.controls; }
}
