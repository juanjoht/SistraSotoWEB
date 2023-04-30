import {  Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomerBasicInfo } from 'src/app/ui/models/customer.model';
import { Cities, Depts } from 'src/app/ui/models/param-static.model';
import { params } from 'src/app/ui/models/param.model';
import { CustomerService } from 'src/app/ui/service/customer.service';
import { DriverService } from 'src/app/ui/service/driver.service';
import { ParamStaticService } from 'src/app/ui/service/param-static.service';
import { ParamService } from 'src/app/ui/service/param.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-customer-basic-edit',
  templateUrl: './customer-basic-edit.component.html',
  styleUrls: ['./customer-basic-edit.component.scss']
})
export class CustomerBasicEditComponent implements OnInit  {
  @Input() isTransporter: boolean = false;
  @Input() isDriver: boolean = false;
  @Input() customerBasicEdit!: CustomerBasicInfo;
  @Input() viewMode: boolean = false;
  @Input() disabledDocInfo: boolean = false;
  formGrouBasic!: FormGroup;
  customerBasic: CustomerBasicInfo = {};
  submittedBasic: boolean = false;
  documentTypes: params[] = [];
  depts: Depts[] = [];
  cities: Cities[] = [];
  thirdPartyType: string = "";
  urlImg: string = "";
  srcImg: string = "";
  seePhoto: boolean = false;
  selectedPicture: boolean = false;
  isEdit: boolean = false;
  constructor(
    private formBuilder: FormBuilder, 
    private paramStaticService: ParamStaticService,
    private paramService: ParamService,
    private customerService: CustomerService,
    private driverService: DriverService,
    private messageService: MessageService) { }

    checkPhoto(value:boolean)
    {
      this.seePhoto = value;
    }

  ngOnInit() {
    this.submittedBasic = false;
    this.getDocTypes();
    this.getDepts();
    if (Object.keys(this.customerBasicEdit).length === 0){
      this.formGrouBasic = this.formBuilder.group({
        documentTypeSelected: ['',[Validators.required]],
        docNumber: ['', [Validators.required]],
        name: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        cellphone: ['', []],
        email : ['', [Validators.required,Validators.email]],
        deptSelected:['',[Validators.required]],
        citySelected:['',[Validators.required]],
        address:['', [Validators.required]],
        stateSelected:[true],
        payDeadline:['']
       });
    }else
    {
      this.isEdit = true;
      this.setObjCustomerEdit();
    }
     
     if(this.isTransporter)
     {
      this.f["payDeadline"].setValidators(Validators.required);
      this.formGrouBasic.get("payDeadline")?.updateValueAndValidity();
     }

  }


  setObjCustomerEdit()
  {
    this.formGrouBasic = this.formBuilder.group({
      documentTypeSelected: [{value: this.customerBasicEdit.docType , disabled: this.disabledDocInfo},[Validators.required]],
      docNumber: [{value:this.customerBasicEdit.docNumber, disabled: this.disabledDocInfo}, [Validators.required]],
      name: [{value:this.customerBasicEdit.name, disabled: this.viewMode}, [Validators.required]],
      phone: [{value:this.customerBasicEdit.phone, disabled: this.viewMode}, [Validators.required]],
      cellphone: [{value: this.customerBasicEdit.cellPhone, disabled: this.viewMode}, []],
      email : [{value: this.customerBasicEdit.email, disabled: this.viewMode}, [Validators.email]],
      deptSelected:[{value: this.customerBasicEdit.dept, disabled: this.viewMode},[Validators.required]],
      citySelected:[{value: this.customerBasicEdit.city, disabled: this.viewMode},[Validators.required]],
      address:[{value: this.customerBasicEdit.address, disabled: this.viewMode}, [Validators.required]],
      stateSelected:[{value: this.customerBasicEdit.state === 'Activo' ? true: false, disabled: this.viewMode}],
      payDeadline:[{value: this.customerBasicEdit.payDeadline, disabled: this.viewMode}]
     });

     if(this.isDriver)
     {
      this.srcImg = `${environment.urlBaseApi.replace('api','')}${this.customerBasicEdit.urlImg}`
      this.urlImg = this.customerBasicEdit.urlImg as string;
     }
  }


  changeDept(event: any)
  {
    let deptId = this.depts.find(x=>x.name === event.value)?.id as string;
    this.getCities(deptId);
  }
  get f() { return this.formGrouBasic?.controls; }


  getDocTypes(){
    this.paramService.getParamByType('Tipos de Documento de Identidad')
            .subscribe({
                next: (data:any) => {
                  this.documentTypes = data;
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                }
            });
  }

  getDepts(){
    this.paramStaticService.getDepts()
            .subscribe({
                next: (data:any) => {
                  this.depts = data;
                  if (Object.keys(this.customerBasicEdit).length !== 0){
                    let deptId = this.depts.find(x=>x.name === this.customerBasicEdit.dept)?.id as string;
                    this.getCities(deptId);
                    this.f["citySelected"].setValue(this.customerBasicEdit.city);
                  }
                },
                error: error => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                }
            });
  }

  getCities(id: string){
    this.paramStaticService.getCitiesByDept(id)
    .subscribe({
        next: (data:any) => {
          this.cities = data;
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
        }
    });
  }

  getThirdParty(){
    let docNum: any = this.formGrouBasic.get('docNumber')?.value;
    if(docNum !== '')
    {
      this.customerService.getThirdParty(docNum as number)
      .subscribe({
          next: (data:any) => {
          if (Object.keys(data).length !== 0) {
            this.customerBasicEdit.id = data.id;
            this.customerBasicEdit.docType = data.docType;
            this.customerBasicEdit.docNumber = data.docNumber;
            this.customerBasicEdit.name = data.name;
            this.customerBasicEdit.phone = data.phone;
            this.customerBasicEdit.cellPhone = data.cellPhone;
            this.customerBasicEdit.email = data.email;
            this.customerBasicEdit.dept = data.dept;
            this.customerBasicEdit.city = data.city;
            this.customerBasicEdit.address = data.address;
            this.customerBasicEdit.state = data.state;
            this.customerBasicEdit.payDeadline = data.payDeadline;
            this.thirdPartyType = data.thirdParty;
            this.setObjCustomerEdit();
            this.getDepts();
          }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message.detail, life: 5000 });
          }
      });
    }
  }

  onSelect(event: any)
  {
    this.selectedPicture = true;
  }

  uploadPictureDriver(event: any)
  {
   const formData: FormData = new FormData();
   event.files.forEach((element: any) => {
           formData.append('', element);
   });
   formData.append('NumeroDocumento', this.formGrouBasic.get('docNumber')?.value);
   this.UploadPictureDriver(formData); 
  }

  UploadPictureDriver(formData: FormData)
  {
   this.driverService.postUploadImageDriverDoc(formData)
               .subscribe({
                   next: (data) => {
                     if(data !== null)
                     {
                      this.urlImg = data;
                      this.selectedPicture = false;
                      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Foto del conductor Cargada', life: 3000 });
                     }
                   },
                   error: error => {
                     this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.detail, life: 5000 });
                   }
               });
 
  }

}
