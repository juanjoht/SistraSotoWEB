import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { CustomerService } from './ui/service/customer.service';
import { AuthGuardService } from './ui/service/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './common/jwt.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { Common } from './common/common';
import { ParamStaticService } from './ui/service/param-static.service';
import { ParamService } from './ui/service/param.service';
import { TransporterService } from './ui/service/transporter.service';
import { VehicleService } from './ui/service/vehicle.service';
import { DriverService } from './ui/service/driver.service';
import { UserService } from './ui/service/user.service';
import { ProfileService } from './ui/service/profile.service';
import { ProviderService } from './ui/service/provider.service';
import { MaterialService } from './ui/service/material.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return Common.Token;
        },
        allowedDomains: ['localhost'],
        disallowedRoutes: ['localhost/auth/login']
      }
    })
  ],
  providers: [
      AuthGuardService,
      { provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
     },
     CustomerService,ParamStaticService, ParamService, TransporterService, VehicleService, DriverService,UserService, ProfileService, ProviderService, MaterialService],
  bootstrap: [AppComponent]
})
export class AppModule { }
