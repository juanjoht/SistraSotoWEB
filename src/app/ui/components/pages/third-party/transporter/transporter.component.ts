import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerBasicEditComponent } from '../customer/customer-basic-edit.component';
import { TransporterBasicInfo } from 'src/app/ui/models/transporter.model';
import { TransporterService } from 'src/app/ui/service/transporter.service';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrls: ['./transporter.component.scss'],
  providers: [MessageService]
})
export class TransporterComponent implements OnInit {
  @ViewChild(CustomerBasicEditComponent)editBasic!: CustomerBasicEditComponent;
  transporters: TransporterBasicInfo[] = [];
  cols: any[] = [];
  trasnporterDialog: boolean = false;
  commercialInfoTab: boolean = true;
  buildingListTab: boolean = true;
  transporterListTab: boolean = true;
  shippingListTab: boolean = true;
  showOptions: boolean = true;
  constructor(private transporterService: TransporterService, private messageService: MessageService) { }


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
    this.transporterService.getTransporter()
    .subscribe({
        next: (data:any) => {
          this.transporters = data;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          console.log(error);
        }
    });
  }
}
