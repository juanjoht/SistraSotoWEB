import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'customer', loadChildren: () => import('./third-party/customer/customer.module').then(m => m.CustomerModule) },
        { path: 'transporter', loadChildren: () => import('./third-party/transporter/transporter.module').then(m => m.TransporterModule) },
        { path: 'provider', loadChildren: () => import('./third-party/provider/provider.module').then(m => m.ProviderModule) },
        { path: 'driver', loadChildren: () => import('./third-party/driver/driver.module').then(m => m.DriverModule) },
        { path: 'user', loadChildren: () => import('./security/user/user.module').then(m => m.UserModule) },
        { path: 'userprofile', loadChildren: () => import('./security/user/user-profile.module').then(m => m.UserProfileModule) },
        { path: 'parameter', loadChildren: () => import('./security/parameters/parameters.module').then(m => m.ParametersModule) },
        { path: 'vehicle', loadChildren: () => import('./crud/vehicle/vehicle.module').then(m => m.VehicleModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
