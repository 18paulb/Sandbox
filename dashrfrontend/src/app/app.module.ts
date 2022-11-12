import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

// import the MapsModule for the Maps component
import { MapsModule } from '@syncfusion/ej2-angular-maps'

import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { OrderlistComponent } from './orderlist/orderlist.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    OrderlistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
