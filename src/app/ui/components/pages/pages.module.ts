import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { DriverComponent } from './third-party/driver/driver.component';

@NgModule({
    declarations: [
    DriverComponent
  ],
    imports: [
        CommonModule,
        PagesRoutingModule
    ]
})
export class PagesModule { }
