import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { ProductService } from './ui/service/product.service';
import { CustomerService } from './ui/service/customer.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule
  ],
  providers: [ProductService, CustomerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
