import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RateTransport } from 'src/app/ui/models/rate-transport.model';
import { route } from 'src/app/ui/models/route.model';
import { RouteService } from 'src/app/ui/service/route.service';

@Component({
  selector: 'app-rate-transport-edit',
  templateUrl: './rate-transport-edit.component.html',
  styleUrls: ['./rate-transport-edit.component.scss']
})
export class RateTransportEditComponent {
  @Input() rateEdit!: RateTransport;
  @Input() viewMode: boolean = false;

  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  routes: route[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private RouteService: RouteService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getRouteList();
    if (Object.keys(this.rateEdit).length === 0){
    this.formGroupBasic = this.formBuilder.group({
      routeSelected: ['',[Validators.required]],
      valuem3: ['', [Validators.required]],
      valueton: ['', [Validators.required]],
      valueMinm3: ['', [Validators.required]],
      valueMaxm3 : ['', [Validators.required]],
      valueMinTon: ['', [Validators.required]],
      valueMaxton:['',[Validators.required]],
      stateSelected:[true]
     });
    }else
    {
      this.formGroupBasic = this.formBuilder.group({
        routeSelected: [{value: this.rateEdit.routeId , disabled: this.viewMode},[Validators.required]],
        valuem3: [{value:this.rateEdit.valueM3, disabled: this.viewMode}, [Validators.required]],
        valueton: [{value:this.rateEdit.valueTon, disabled: this.viewMode}, [Validators.required]],
        valueMinm3: [{value: this.rateEdit.valueMinM3, disabled: this.viewMode}, [Validators.required]],
        valueMaxm3 : [{value: this.rateEdit.valueMaxM3, disabled: this.viewMode}, [Validators.required]],
        valueMinTon:[{value: this.rateEdit.valueMinTon, disabled: this.viewMode},[Validators.required]],
        valueMaxton:[{value: this.rateEdit.valueMaxTon, disabled: this.viewMode},[Validators.required]],
        stateSelected:[{value: this.rateEdit.state === 'Activo' ? true: false, disabled: this.viewMode}]
       });
    }
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



  get f() { return this.formGroupBasic?.controls; }

}
