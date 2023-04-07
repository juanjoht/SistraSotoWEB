import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';
import { Cities, Depts } from 'src/app/ui/models/param-static.model';
import { ParamStaticService } from 'src/app/ui/service/param-static.service';

interface DocTypes {
  name: string;
}

@Component({
  selector: 'app-customer-basic-edit',
  templateUrl: './customer-basic-edit.component.html',
  styleUrls: ['./customer-basic-edit.component.scss']
})
export class CustomerBasicEditComponent implements OnInit  {
  @Input() isTransporter: boolean = false;
  formGrouBasic!: FormGroup;
  customerBasic: CustomerBasicInfo = {};
  submittedBasic: boolean = false;
  documentTypes: DocTypes[] = [];
  depts: Depts[] = [];
  cities: Cities[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private paramStaticService: ParamStaticService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.submittedBasic = false;

    this.documentTypes = [
      { name: 'CC' },
      { name: 'CE' },
      { name: 'Passaporte' }
     ];
     this.getDepts();
     /*this.cities = [
      { name: 'Medellin' },
      { name: 'Itagui' },
      { name: 'Envigado' }
     ];*/
     this.formGrouBasic = this.formBuilder.group({
      documentTypeSelected: ['',[Validators.required]],
      docNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      cellphone: ['', []],
      email : ['', [Validators.email]],
      deptSelected:['',[Validators.required]],
      citySelected:['',[Validators.required]],
      address:['', [Validators.required]],
      payDeadline:['']
     });
     this.formGrouBasic.controls.deptSelected.valueChanges.subscribe((data) => {
      this.getCities(data.id)
     });
     if(this.isTransporter)
     {
      this.f["payDeadline"].setValidators(Validators.required);
      this.formGrouBasic.get("payDeadline")?.updateValueAndValidity();
     }


  }
  get f() { return this.formGrouBasic?.controls; }

  getDepts(){
    this.paramStaticService.getDepts()
            .subscribe({
                next: (data:any) => {
                  console.log(data);
                  this.depts = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                  console.log(error);
                }
            });

  }

  getCities(id: string){
    this.paramStaticService.getCitiesByDept(id)
    .subscribe({
        next: (data:any) => {
          console.log(data);
          this.cities = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
          console.log(error);
        }
    });
  }

}
