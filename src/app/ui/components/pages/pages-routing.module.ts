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
        { path: 'material', loadChildren: () => import('./crud/material/material.module').then(m => m.MaterialModule) },
        { path: 'route', loadChildren: () => import('./crud/route/route.module').then(m => m.RouteModule) },
        { path: 'rate-transport', loadChildren: () => import('./crud/rate-transport/rate-transport.module').then(m => m.RateTransportModule) },
        { path: 'order', loadChildren: () => import('./programming/order/order.module').then(m => m.OrderModule) },
        { path: 'order-approve', loadChildren: () => import('./programming/order/order-approve.module').then(m => m.OrderApproveModule) },
        { path: 'provider-order', loadChildren: () => import('./programming/provider-order/provider-order.module').then(m => m.ProviderOrderModule) },
        { path: 'preasignment', loadChildren: () => import('./programming/preassignment/preassignment.module').then(m => m.PreassignmentModule) },
        { path: 'load-plant', loadChildren: () => import('./plant/plant-load/plant-load.module').then(m => m.PlantLoadModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
