import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'customer', loadChildren: () => import('./third-party/customer/customer.module').then(m => m.CustomerModule) },
        { path: 'transporter', loadChildren: () => import('./third-party/transporter/transporter.module').then(m => m.TransporterModule) },
        { path: 'provider', loadChildren: () => import('./third-party/provider/provider.module').then(m => m.ProviderModule) },
        { path: 'driver', loadChildren: () => import('./third-party/driver/driver.module').then(m => m.DriverModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }