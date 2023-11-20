import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo, CustomerBuildings } from 'src/app/ui/models/customer.model';
import { Cities, Depts } from 'src/app/ui/models/param-static.model';
import { route, routeType } from 'src/app/ui/models/route.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { ParamStaticService } from 'src/app/ui/service/param-static.service';
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

  customersOrigin: any[] = [];
  customersDestination: any[] = []
  customersBuildingsOrigin: any[] = [];
  customersBuildingsDestination: any[] = [];
  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  locations: CustomerBasicInfo[] = []
  depts: Depts[] = [];
  cities: Cities[] = [];
  clientID : number = 0;
  clientIDSelected: number = 0;
  constructor(private formBuilder: FormBuilder,
      private paramService: ParamService,
      private paramStaticService: ParamStaticService,
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
   // this.getCustomerList();
    if (Object.keys(this.routelEdit).length === 0){
    this.formGroupBasic = this.formBuilder.group({
      name: ['',[Validators.required]],
      runningTime:[0,[Validators.required]],
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
        runningTime:[{value:this.routelEdit.runningTime, disabled: this.viewMode},[Validators.required]],
        originTypeSelected: [{value:this.routelEdit.originType, disabled: this.viewMode}, [Validators.required]],
        originClientSelected: [{value:'', disabled: this.viewMode}, [Validators.required]],
        originSelected: [{value:this.routelEdit.origin, disabled: this.viewMode}, [Validators.required]],
        destinationTypeSelected: [{value: this.routelEdit.destinationType, disabled: this.viewMode}, [Validators.required]],
        destinationClientSelected : [{value: '', disabled: this.viewMode}, [Validators.required]],
        destinationSelected:[{value: this.routelEdit.destination, disabled: this.viewMode},[Validators.required]],
        stateSelected:[{value: this.routelEdit.state === 'Activo' ? true: false, disabled: this.viewMode}]
       });
       this.changeType('origin');
       this.changeType('destination');
    }
  }

  getCustomerList(type: string){
    this.customerService.getCustomerBasic()
    .subscribe({
        next: (data:any) => {
          if(type === 'origin'){
            this.customersOrigin = data;
          }else{
            this.customersDestination = data;
          }
          if (Object.keys(this.routelEdit).length !== 0){
            let clientIDOriginSelected = this.getClientId(this.customersOrigin, this.routelEdit.originClient?.toString()) as number
            this.f.originClientSelected.setValue(clientIDOriginSelected);
            if(this.routelEdit.originType === 'Obra'){
               this.getBuildingsByClient(clientIDOriginSelected,'origin');
            }
            let clientIDDestinationSelected = this.getClientId(this.customersDestination, this.routelEdit.destinationClient?.toString()) as number
            this.f.destinationClientSelected.setValue(clientIDDestinationSelected);
            if(this.routelEdit.destinationType === 'Obra'){
              this.getBuildingsByClient(clientIDDestinationSelected,'destination');
              this.f["destinationSelected"].setValue(this.routelEdit.destination);

            }
          }
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  getDepts(type: string){
    this.paramStaticService.getDepts()
            .subscribe({
                next: (data:any) => {
                  if(type === 'origin'){
                    this.customersOrigin = data;
                  }else{
                    this.customersDestination = data;
                  }
                  if (Object.keys(this.routelEdit).length !== 0){
                    if(type === 'origin'){
                      let deptId = this.customersOrigin.find(x=>x.name === this.routelEdit.originClient)?.id as string;
                      this.getCities(deptId,type);
                      this.f["originClientSelected"].setValue(deptId);
                      this.f["originSelected"].setValue(this.routelEdit.origin);
                    }else{
                      let deptId = this.customersDestination.find(x=>x.name === this.routelEdit.destinationClient)?.id as string;
                      this.getCities(deptId,type);
                      this.f["destinationClientSelected"].setValue(deptId);
                      this.f["destinationSelected"].setValue(this.routelEdit.destination);
                    }
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });
  }

  getCities(id: string, type:string){
    this.paramStaticService.getCitiesByDept(id)
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
            if (Object.keys(this.routelEdit).length !== 0){
              this.f["originSelected"].setValue(this.routelEdit.origin);
            }
          }else{
            this.customersBuildingsDestination = data;
            if (Object.keys(this.routelEdit).length !== 0){
              this.f["destinationSelected"].setValue(this.routelEdit.destination);
            }
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
      }else
      {
        this.getCities(event.value,type);
      }
    }else
    {
      if(this.f?.destinationTypeSelected.value === 'Obra'){
        this.getBuildingsByClient(this.clientID,type);
      }else
      {
        this.getCities(event.value,type);
      }
    }
   
  }

  changeType(type: string)
  {
    if(type === 'origin'){
      if(this.f?.originTypeSelected.value === 'Obra'){
        this.getCustomerList(type);
      }else
      {
        this.getDepts(type);  
      }
    }else
    {
      if(this.f?.destinationTypeSelected.value === 'Obra'){
        this.getCustomerList(type);
      }else
      {
        this.getDepts(type);  
      }
    }
  }

  


  get f() { return this.formGroupBasic?.controls; }
}
