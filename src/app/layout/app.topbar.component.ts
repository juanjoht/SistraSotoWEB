import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Common } from '../common/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

    constructor(private router: Router, private formBuilder: FormBuilder, public layoutService: LayoutService) { 
        this.msgWellcome = `Bienvenido, ${Common.UserName}`;
    }

    ngOnInit() {
        this.formChangePw = this.formBuilder.group({
            newPass: ['',[Validators.required]],
            confirmPass: ['', [Validators.required]]
        });
   
   
     }
     get f() { return this.formChangePw?.controls; }

    logOut()
    {
        Common.Token = '';
        Common.UserName = '';
        Common.Modules = [];
        localStorage.removeItem("userName");
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
    }
}
