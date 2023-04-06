import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
interface Origins {
  name: string;
}
interface Destinations {
  name: string;
}
interface Materials {
  name: string;
}
@Component({
  selector: 'app-customer-shipping-edit',
  templateUrl: './customer-shipping-edit.component.html',
  styleUrls: ['./customer-shipping-edit.component.scss']
})
export class CustomerShippingEditComponent implements OnInit {
  formGroupShippingRate!: FormGroup;
  submittedShippingRate: boolean = false;
  origins: Origins[] = [];
  destinations: Destinations[] = [];
  materials: Materials[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.origins = [
      { name: 'Santa fe de antioquia' },
      { name: 'Llanogrande' }
     ];
     this.destinations = [
      { name: 'Obra 1' },
      { name: 'Obra 2' },
      { name: 'Obra 3' }
     ];
     this.materials = [
      { name: 'Arena de concreto' },
      { name: 'Triturado 1/2' }      
     ];
     this.formGroupShippingRate = this.formBuilder.group({
      originSelected: ['',[Validators.required]],
      destinationSelected: ['', [Validators.required]],
      materialSelected: ['', [Validators.required]],
      measureUnit: ['', [Validators.required]],
      shippingValue: ['', [Validators.required]]
     });


  }
  get f() { return this.formGroupShippingRate?.controls; }

}
