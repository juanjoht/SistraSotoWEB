import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';

interface DocTypes {
  name: string;
}
interface Depts {
  name: string;
}
interface Cities {
  name: string;
}
@Component({
  selector: 'app-customer-basic-edit',
  templateUrl: './customer-basic-edit.component.html',
  styleUrls: ['./customer-basic-edit.component.scss']
})
export class CustomerBasicEditComponent implements OnInit  {
  formGrouBasic!: FormGroup;
  customerBasic: CustomerBasicInfo = {};
  submittedBasic: boolean = false;
  documentTypes: DocTypes[] = [];
  depts: Depts[] = [];
  cities: Cities[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.documentTypes = [
      { name: 'CC' },
      { name: 'CE' },
      { name: 'Passaporte' }
     ];
     this.depts = [
      { name: 'Antioquia' },
      { name: 'Cundinamarca' },
      { name: 'Atlantico' }
     ];
     this.cities = [
      { name: 'Medellin' },
      { name: 'Itagui' },
      { name: 'Envigado' }
     ];
     this.formGrouBasic = this.formBuilder.group({
      documentTypeSelected: ['',[Validators.required]],
      docNumber: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      cellphone: ['', []],
      email : ['', [Validators.email]],
      deptSelected:['',[Validators.required]],
      citySelected:['',[Validators.required]],
      address:['', [Validators.required]]
     });


  }
  get f() { return this.formGrouBasic?.controls; }

}
