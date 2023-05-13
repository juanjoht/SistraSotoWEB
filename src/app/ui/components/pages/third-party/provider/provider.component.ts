import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerBasicEditComponent } from '../customer/customer-basic-edit.component';
import { ProviderBasicInfo } from 'src/app/ui/models/provider.model';
import { MessageService } from 'primeng/api';
import { ProviderService } from 'src/app/ui/service/provider.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss'],
  providers: [MessageService]
})
export class ProviderComponent implements OnInit {
  @ViewChild(CustomerBasicEditComponent)editBasic!: CustomerBasicEditComponent;
  providers: ProviderBasicInfo[] = [];
  cols: any[] = [];
  providerDialog: boolean = false;
  materialPricesTab: boolean = true;
  loadingTimesTab: boolean = true;
  showOptions: boolean = true;
  constructor(private providerService: ProviderService, private messageService: MessageService) { }


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
    this.providerService.getProvider()
    .subscribe({
        next: (data:any) => {
          this.providers = data;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          console.log(error);
        }
    });
  }
}


