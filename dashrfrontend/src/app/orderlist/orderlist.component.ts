import { Component, OnInit } from '@angular/core';
import { HttpBackend, HttpParams, HttpClient } from '@angular/common/http';
import { last, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css'],
})
export class OrderlistComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getOrders();
  }

  public getOrdersUrl = 'http://localhost:8000/orders';

  public uberOrders: any = [];
  public doordashOrders: any = [];
  public grubhubOrders: any = [];
  public bingKey =
    'ApscR-2i8TspsYdQ4QtRVWVVaM08wKQF2yozbQ3e_3BUriw0V5a1OJydo_9SPuF9';
  public startingLat = 40.235728;
  public startingLon = -111.653169;

  public async getOrders() {
    let data = await lastValueFrom(this.http.get<any>(this.getOrdersUrl));
    for (let order of data) {
      let distance = await this.getDistance(
        this.startingLat,
        this.startingLon,
        order.latitude,
        order.longitude
      );

      distance = Math.round(distance * 10) / 10

      if (order.company.toLowerCase() == 'uber') {
        this.uberOrders.push([order, distance]);
      } else if (order.company.toLowerCase() == 'doordash') {
        this.doordashOrders.push([order, distance]);
      } else if (order.company.toLowerCase() == 'grubhub') {
        this.grubhubOrders.push([order, distance]);
      }
    }
  }
  

  public async getDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
    // debugger
    let resultDistance = 0;
    return fetch(
      'http://dev.virtualearth.net/REST/V1/Routes?wp.0=' +
        lat1 +
        ',' +
        lon1 +
        '&wp.1=' +
        lat2 +
        ',' +
        lon2 +
        '&key=' +
        this.bingKey
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)

        let distance =
          data.resourceSets[0].resources[0].routeLegs[0].travelDistance;
        //Converts to Minutes
        distance = distance * 0.621371;
        console.log('Distance: ' + resultDistance + ' miles');
        return distance;
      });
    
  }
}
