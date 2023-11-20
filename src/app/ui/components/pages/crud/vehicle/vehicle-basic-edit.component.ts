import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { params } from 'src/app/ui/models/param.model';
import { TransporterBasicInfo } from 'src/app/ui/models/transporter.model';
import { Vehicle } from 'src/app/ui/models/vehicles.model';
import { ParamService } from 'src/app/ui/service/param.service';
import { TransporterService } from 'src/app/ui/service/transporter.service';

@Component({
  selector: 'app-vehicle-basic-edit',
  templateUrl: './vehicle-basic-edit.component.html',
  styleUrls: ['./vehicle-basic-edit.component.scss']
})
export class VehicleBasicEditComponent implements OnInit {
  @Input() vehicleEdit!: Vehicle;
  @Input() viewMode: boolean = false;

  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  vehicleTypes: params[] = [];
  transporters: TransporterBasicInfo[] = [];
  maxModel: number =  new Date().getFullYear() - 1;
  maxDate: Date = new Date();
  
  constructor(
    private formBuilder: FormBuilder,
    private paramService: ParamService,
    private transporterService : TransporterService, 
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getAllowedVehicleTypes();
    this.getTransporters();
    if (Object.keys(this.vehicleEdit).length === 0){
    this.formGroupBasic = this.formBuilder.group({
      licensePlate: ['',[Validators.required,Validators.pattern(/^[A-Za-z]{3}[\d]{3}$/)]],
      vehicleTypeSelected: ['', [Validators.required]],
      model: ['', [Validators.required]],
      color: ['', [Validators.required]],
      ChassisNumber: ['', [Validators.required]],
      grossWeight : ['', [Validators.required]],
      cubed:[{value:'No', disabled: true}],
      capacityM3:[''],
      capacityTon:['', [Validators.required]],
      transporterSelected : ['', [Validators.required]],
      kmToInspection:['',[Validators.required]],
      kmLastInspection:['',[Validators.required]],
      dateLastInspection:['', [Validators.required]],
      stateSelected:[true]
     },
     { 
      validators: [this.kmMax('kmToInspection','kmLastInspection') ]
     }
     );
    }else
    {
      this.formGroupBasic = this.formBuilder.group({
        licensePlate: [{value: this.vehicleEdit.licensePlate , disabled: this.viewMode},[Validators.required,Validators.pattern(/^[A-Za-z]{3}[\d]{3}$/)]],
        vehicleTypeSelected: [{value:this.vehicleEdit.type, disabled: this.viewMode}, [Validators.required]],
        model: [{value:this.vehicleEdit.model, disabled: this.viewMode}, [Validators.required]],
        color: [{value:this.vehicleEdit.color, disabled: this.viewMode}, [Validators.required]],
        ChassisNumber: [{value: this.vehicleEdit.chassisNumber, disabled: this.viewMode}, [Validators.required]],
        grossWeight : [{value: this.vehicleEdit.grossWeight, disabled: this.viewMode}, [Validators.required]],
        cubed:[{value: this.vehicleEdit.cubed, disabled: this.viewMode}],
        capacityM3:[{value: this.vehicleEdit.capacityM3, disabled: this.viewMode}],
        capacityTon:[{value: this.vehicleEdit.capacityTon, disabled: this.viewMode}, [Validators.required]],
        transporterSelected:[{value: this.vehicleEdit.transporter, disabled: this.viewMode}, [Validators.required]],
        kmToInspection:[{value: this.vehicleEdit.kilometerToInspection, disabled: this.viewMode},[Validators.required]],
        kmLastInspection:[{value: this.vehicleEdit.kilometerLastInspection, disabled: this.viewMode},[Validators.required]],
        dateLastInspection:[{value: new Date(this.vehicleEdit.dateLastInspection as string), disabled: this.viewMode},[Validators.required]],
        stateSelected:[{value: this.vehicleEdit.state === 'Activo' ? true: false, disabled: this.viewMode}]
       });
    }
  }

  kmMax(kmNext: any, kmLast: any){
    return (formGroup: FormGroup) => {
    const kNext = formGroup.controls[kmNext];
    const kLast = formGroup.controls[kmLast];
    
      if(kNext.value > kLast.value)
      {
        kNext.setErrors({ maxKmError: true });
      }else
      {
        kNext.setErrors(null);
      }
    }
  }

  getAllowedVehicleTypes(){
    this.paramService.getParamByType('Tipos de vehículos permitidos')
            .subscribe({
                next: (data:any) => {
                  this.vehicleTypes = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });                  
                }
            });
  }

  getTransporters(){
    this.transporterService.getTransporter()
    .subscribe({
        next: (data:any) => {
          this.transporters = data.filter((x:any) => x.state === 'Activo');
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          console.log(error);
        }
    });
  }



  get f() { return this.formGroupBasic?.controls; }

}
