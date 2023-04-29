import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { paramType, params } from 'src/app/ui/models/param.model';
import { ParamService } from 'src/app/ui/service/param.service';

@Component({
  selector: 'app-parameters-edit',
  templateUrl: './parameters-edit.component.html',
  styleUrls: ['./parameters-edit.component.scss']
})
export class ParametersEditComponent implements OnInit {
  @Input() paramEdit!: params;

  formGroupBasic!: FormGroup;
  submittedBasic: boolean = false;
  paramTypes: paramType[] = [];
  constructor(
    private formBuilder: FormBuilder, 
    private paramService:ParamService,
    private messageService: MessageService) { }
  
    ngOnInit(): void {
      this.submittedBasic = false;
      this.getParamTypes();
      if (Object.keys(this.paramEdit).length === 0){
        this.formGroupBasic = this.formBuilder.group({
          typeSelected: ['',[Validators.required]],
          desc: ['', [Validators.required]],
          value1: [''],
          value2: [''],
          stateSelected:[true],
          expireSelected:[false]
         });
      }else
      {
        this.formGroupBasic = this.formBuilder.group({
          typeSelected: [this.paramEdit.type ,[Validators.required]],
          desc: [this.paramEdit.name, [Validators.required]],
          value1: [this.paramEdit.value1, []],
          value2: [ this.paramEdit.value2, []],
          expireSelected:[this.paramEdit.expire, []],
          stateSelected:[this.paramEdit.state === 'Activo' ? true: false, []],
         });
      }
    }
    
    getParamTypes(){
      this.paramService.getParamTypes()
      .subscribe({
          next: (data:any) => {
            this.paramTypes = data;
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }

    get f() { return this.formGroupBasic?.controls; }

}
