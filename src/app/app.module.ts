import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { ProductService } from './ui/service/product.service';
import { CustomerService } from './ui/service/customer.service';
import { AuthGuardService } from './ui/service/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './common/jwt.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { Common } from './common/common';
import { ParamStaticService } from './ui/service/param-static.service';
import { ParamService } from './ui/service/param.service';

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
    ProductService, CustomerService,ParamStaticService, ParamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
