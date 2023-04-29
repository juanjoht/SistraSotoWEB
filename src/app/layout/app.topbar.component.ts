import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Common } from '../common/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    msgWellcome: any = '';
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(private router: Router,public layoutService: LayoutService) { 
        this.msgWellcome = `Bienvenido, ${Common.UserName}`;
    }

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
}
