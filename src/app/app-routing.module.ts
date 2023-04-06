import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [];

@NgModule({
  imports: [
      RouterModule.forRoot([
          //{ path: '', pathMatch: 'full', redirectTo: 'login' },
          //{ path: 'login', loadChildren: () => import('./ui/components/auth/login/login.module').then(m => m.LoginModule) },
          {
              path: '', component: AppLayoutComponent,
              children: [
                  { path: '', loadChildren: () => import('./ui/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                  { path: 'pages', loadChildren: () => import('./ui/components/pages/pages.module').then(m => m.PagesModule) }
              ]
          },
          { path: '**', redirectTo: '/notfound' },
      ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
