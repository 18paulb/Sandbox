import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

// import the MapsModule for the Maps component
import { MapsModule } from '@syncfusion/ej2-angular-maps';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
