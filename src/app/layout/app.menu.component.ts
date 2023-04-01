import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Modulos',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Terceros',
                        icon: 'pi pi-fw pi-ticket',
                        items: [
                            {
                                label: 'Clientes',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/pages/customer']
                            },
                            {
                                label: 'Transportadores',
                                icon: 'pi pi-fw pi-truck',
                                routerLink: ['/pages/transporter']
                            },
                            {
                                label: 'Proveedores',
                                icon: 'pi pi-fw pi-sync',
                                routerLink: ['/pages/provider']
                            },
                            {
                                label: 'Conductores',
                                icon: 'pi pi-fw pi-car',
                                routerLink: ['/pages/driver']
                            }
                        ]
                    },
                    {
                        label: 'Maestros',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Programación',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/timeline']
                    },
                    {
                        label: 'Administrativo',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                    {
                        label: 'Reportes',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/pages/empty']
                    },
                    {
                        label: 'Seguridad',
                        icon: 'pi pi-fw pi-shield',
                        routerLink: ['/pages/empty']
                    }
                ]
            }
        ];
    }
}
