import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicEditComponent } from '../customer/customer-basic-edit.component';
import { DriverInfo } from 'src/app/ui/models/driver.model';
import { DriverService } from 'src/app/ui/service/driver.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  providers: [MessageService]
})
export class DriverComponent implements OnInit {
  @ViewChild(CustomerBasicEditComponent)editBasic!: CustomerBasicEditComponent;
  drivers: DriverInfo[] = [];
  cols: any[] = [];
  driverDialog: boolean = false;
  generalInfoTab: boolean = true;
  docListTab: boolean = true;
  showOptions: boolean = true;
  constructor(private driverService: DriverService, private messageService: MessageService) { }


  ngOnInit() {
    this.getGridData();

    this.cols = [
        { field: 'docNumber', header: 'Número documento' },
        { field: 'name', header: 'Nombre' },
        { field: 'phone', header: 'Teléfono' },
        { field: 'state', header: 'Estado' }
    ];
  }

  reloadGrid(eventData: { reloadGrid: boolean })
  {
    if(eventData.reloadGrid)
    {
      this.getGridData();
    }
  }

  getGridData(){
    this.driverService.getDrivers()
    .subscribe({
        next: (data:any) => {
          this.drivers = data;
        },
        error: (error: { message: any; }) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }
}
