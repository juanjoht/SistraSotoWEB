import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Common } from '../common/common';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    checkPermissions(itemMenu: string) {
        let modules = Common.Modules;
        let module = modules.find(x => x.modulo === itemMenu);
        if (module){
            return module.permiso ? 'show-item' : 'hide-item';
        }else
        return 'hide-item'
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }
                ]
            },
            {
                label: 'Modulos',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Terceros',
                        class: this.checkPermissions('Terceros'),
                        icon: 'pi pi-fw pi-ticket',
                        items: [
                            {
                                label: 'Clientes',
                                class: this.checkPermissions('Terceros-Clientes'),
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/pages/customer']
                            },
                            {
                                label: 'Transportadores',
                                class: this.checkPermissions('Terceros-Transportadores'),
                                icon: 'pi pi-fw pi-truck',
                                routerLink: ['/pages/transporter']
                            },
                            {
                                label: 'Proveedores',
                                class: this.checkPermissions('Terceros-Proveedores'),
                                icon: 'pi pi-fw pi-sync',
                                routerLink: ['/pages/provider']
                            },
                            {
                                label: 'Conductores',
                                class: this.checkPermissions('Terceros-Conductores'),
                                icon: 'pi pi-fw pi-car',
                                routerLink: ['/pages/driver']
                            }
                        ]
                    },
                    {
                        label: 'Maestros',
                        class: this.checkPermissions('Maestros'),
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud'],
                        items: [
                            {
                                label: 'Vehículos',
                                class: this.checkPermissions('Maestros-Vehiculos'),
                                icon: 'pi pi-fw pi-car',
                                routerLink: ['/pages/vehicle']
                            },
                            {
                                label: 'Materiales',
                                class: this.checkPermissions('Maestros-Materiales'),
                                icon: 'pi pi-fw pi-wrench',
                                routerLink: ['/pages/material']
                            },
                            {
                                label: 'Rutas',
                                class: this.checkPermissions('Maestros-Rutas'),
                                icon: 'pi pi-fw pi-map-marker',
                                routerLink: ['/pages/route']
                            },
                            {
                                label: 'Tarifas de Transporte',
                                class: this.checkPermissions('Maestros-Tarifas-Transporte'),
                                icon: 'pi pi-fw pi-chart-line',
                                routerLink: ['/pages/rate-transport']
                            }
                        ]
                    },
                    {
                        label: 'Programación',
                        class: this.checkPermissions('Programacion'),
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/timeline'],
                        items: [
                            {
                                label: 'Pedidos del cliente',
                                class: this.checkPermissions('Programacion-PedidosCliente'),
                                icon: 'pi pi-fw pi-hashtag',
                                routerLink: ['/pages/order']
                            },
                            {
                                label: 'Pedidos del cliente - Aprobación',
                                class: this.checkPermissions('Programacion-PedidosClienteAprobacion'),
                                icon: 'pi pi-fw pi-hashtag',
                                routerLink: ['/pages/order-approve']
                            },
                            {
                                label: 'Pedidos Proveedores',
                                class: this.checkPermissions('Programacion-PedidosProveedor'),
                                icon: 'pi pi-fw pi-calendar-plus',
                                routerLink: ['/pages/provider-order']
                            },
                            {
                                label: 'Preasignaciones',
                                class: this.checkPermissions('Programacion-Preasignaciones'),
                                icon: 'pi pi-fw pi-calendar',
                                routerLink: ['/pages/preasignment']
                            }
                        ]
                    },
                    {
                        label: 'Administrativo',
                        class: this.checkPermissions('Administrativo'),
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                    {
                        label: 'Reportes',
                        class: this.checkPermissions('Reportes'),
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/pages/empty']
                    },
                    {
                        label: 'Seguridad',
                        class: this.checkPermissions('Seguridad'),
                        icon: 'pi pi-fw pi-shield',
                        items: [
                            {
                                label: 'Usuarios',
                                class: this.checkPermissions('Seguridad-Usuarios'),
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/pages/user']
                            },
                            {
                                label: 'Perfiles',
                                class: this.checkPermissions('Seguridad-Perfiles'),
                                icon: 'pi pi-fw pi-check',
                                routerLink: ['/pages/userprofile']
                            },
                            {
                                label: 'Parametros',
                                class: this.checkPermissions('Seguridad-Parametros'),
                                icon: 'pi pi-fw pi-table',
                                routerLink: ['/pages/parameter']
                            }
                        ]
                    },
                    {
                        label: 'Carga',
                        class: this.checkPermissions('Carga'),
                        icon: 'pi pi-fw pi-info-circle',
                        items: [
                            {
                                label: 'Carga en Planta',
                                class: this.checkPermissions('Carga-Planta'),
                                icon: 'pi pi-fw pi-eject',
                                routerLink: ['/pages/load-plant']
                            }
                        ]
                    }
                ]
            }
        ];
    }
}
