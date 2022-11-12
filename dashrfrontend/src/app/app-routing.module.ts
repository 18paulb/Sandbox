import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { SuggestedrouteComponent } from './suggestedroute/suggestedroute.component';

const routes: Routes = [
  { path: 'orderlist', component: OrderlistComponent },
  { path: 'map', component: MapComponent },
  { path: 'suggestedroute', component: SuggestedrouteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
