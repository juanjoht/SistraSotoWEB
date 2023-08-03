import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuardService } from './ui/service/auth-guard.service';

const routes: Routes = [];

@NgModule({
  imports: [
      RouterModule.forRoot([
          { path: '', pathMatch: 'full', redirectTo: 'login' },
          { path: 'login', loadChildren: () => import('./ui/components/auth/login/login.module').then(m => m.LoginModule) },
          { path: 'recovery', loadChildren: () => import('./ui/components/auth/recovery/recovery.module').then(m => m.RecoveryModule) },
          {
              path: '', component: AppLayoutComponent,
              children: [
                  { path: 'dashboard', loadChildren: () => import('./ui/components/dashboard/dashboard.module').then(m => m.DashboardModule),canActivate: [AuthGuardService] },
                  { path: 'pages', loadChildren: () => import('./ui/components/pages/pages.module').then(m => m.PagesModule),canActivate: [AuthGuardService] }
              ]
          },
          //{ path: '**', redirectTo: '/notfound' },
      ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
