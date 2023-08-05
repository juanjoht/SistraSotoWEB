import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Common } from '../common/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../ui/service/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [MessageService]
})
export class AppTopBarComponent {
    formChangePw!: FormGroup;
    submittedChangePw : boolean = false;
    msgWellcome: any = '';
    items!: MenuItem[];
    visible: boolean = false;
    position: string = 'center';

   
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(private router: Router, private formBuilder: FormBuilder, public layoutService: LayoutService, private authService: AuthService,private messageService: MessageService) { 
        this.msgWellcome = `Bienvenido, ${Common.UserName}`;
    }

    ngOnInit() {
        this.formChangePw = this.formBuilder.group({
            newPass: ['',[
                Validators.required,
                Validators.pattern('.{8,}') 
            ]],
            confirmPass: ['', [
                Validators.required,
                Validators.pattern('.{8,}'),                  
            ]]
        },
        { 
            validator: this.ConfirmedValidator('newPass', 'confirmPass')
        }
        );
   
   
     }
     get f() { return this.formChangePw?.controls; }

     ConfirmedValidator(controlName: string, matchingControlName: string){
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

    logOut()
    {
        Common.Token = '';
        Common.UserName = '';
        Common.UserId = '';
        Common.Modules = [];
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("modules");
        this.router.navigate(["/login"]);
    }

    showDialog(position: string) {
        this.position = position;
        this.visible = true;
    }

    changePw(){
        this.submittedChangePw = true;
        // stop here if form is invalid
        if (this.formChangePw.invalid) {
            return;
        }
        this.authService.changePw(Common.UserId, this.f.confirmPass.value)
        .subscribe({
          next: (data) => {
            if(data !== null)
            {
              if(data.enviado)
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: data.mensaje, life: 3000 });  
                setTimeout(()=>{this.logOut()}, 5000);  
            }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
          }
      });
    }
}
