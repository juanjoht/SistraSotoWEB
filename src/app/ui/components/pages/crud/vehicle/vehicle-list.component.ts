import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Vehicles } from 'src/app/ui/models/vehicles.model';
import { VehicleService } from 'src/app/ui/service/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  providers: [MessageService]
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicles[] = [];
  cols: any[] = [];
  canRead: boolean = true;
  canCreate: boolean = true;
  canEdit: boolean = true;

  constructor(private vehicleService: VehicleService, private messageService: MessageService) { }

  ngOnInit() {
    this.getGridData();

    this.cols = [
        { field: 'licensePlate', header: 'Placa' },
        { field: 'transporter', header: 'Transportador' },
        { field: 'type', header: 'Tipo' },
        { field: 'capacityM3', header: 'Capacidad m3' },
        { field: 'capacityTon', header: 'Capacidad ton' },
        { field: 'state', header: 'Estado' }
    ];
  }

  getGridData(){
    this.vehicleService.getVehicle()
    .subscribe({
        next: (data:any) => {
          this.vehicles = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

  openNew(){}

  editVehicle(vehicleBasic: any, isviewMode: boolean = false) {}

}
