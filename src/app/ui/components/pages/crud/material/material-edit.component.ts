import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { material } from 'src/app/ui/models/material.model';

@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent implements OnInit {
  @Input() materialEdit!: material;
  @Input() viewMode: boolean = false;

  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService) { }

  ngOnInit(): void {
    if (Object.keys(this.materialEdit).length === 0){
    this.formGroupBasic = this.formBuilder.group({
      material: ['',[Validators.required]],
      unitMass: ['', [Validators.required]],
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
        material: [{value: this.materialEdit.name , disabled: this.viewMode},[Validators.required]],
        unitMass: [{value:this.materialEdit.unitMass, disabled: this.viewMode}, [Validators.required]],
        valuem3: [{value:this.materialEdit.valueM3, disabled: this.viewMode}, [Validators.required]],
        valueton: [{value:this.materialEdit.valueTon, disabled: this.viewMode}, [Validators.required]],
        valueMinm3: [{value: this.materialEdit.valueMinM3, disabled: this.viewMode}, [Validators.required]],
        valueMaxm3 : [{value: this.materialEdit.valueMaxM3, disabled: this.viewMode}, [Validators.required]],
        valueMinTon:[{value: this.materialEdit.valueMinTon, disabled: this.viewMode},[Validators.required]],
        valueMaxton:[{value: this.materialEdit.valueMaxTon, disabled: this.viewMode},[Validators.required]],
        stateSelected:[{value: this.materialEdit.state === 'Activo' ? true: false, disabled: this.viewMode}]
       });
    }
  }


  get f() { return this.formGroupBasic?.controls; }
}
