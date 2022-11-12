import { Component, OnInit, Inject, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

import { Maps, Zoom, ILoadEventArgs, Marker, NavigationLine } from '@syncfusion/ej2-angular-maps';
import { Injectable } from '@angular/core';
import { HttpBackend, HttpParams, HttpClient } from '@angular/common/http';
import { last, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-suggestedroute',
  templateUrl: './suggestedroute.component.html',
  styleUrls: ['./suggestedroute.component.css']
})
export class SuggestedrouteComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ///@Input() public restaurant:any
  public restaurant = "Wendy's"

  public getOrdersUrl = "http://localhost:8000/orders"

  public startingLat = 40.235728
  public startingLon = -111.653169

  public chipotleLat = 40.251506
  public chipotleLon = -111.658745

  public tacoBellLat = 40.250467
  public tacoBellLon = -111.661281

  public mcdonaldLat = 40.249708
  public mcdonaldLon = -111.662162

  public chickfilaLat = 40.250757
  public chickfilaLon = -111.667413

  public wendysLat = 40.250437
  public wendysLon = -111.656065

  public orders:any = []

  public route:any = []

  public predictedEarnings = 0
  public predictedTime = 0
  public distanceTravelled = 0

  ngOnInit(): void {

    //debugger

    this.getOrders()

    //Initial Will go to restaurant
    this.route.push([this.wendysLat, this.wendysLon])

    //this.getRoute(this.wendysLat, this.wendysLon);

    this.zoomSettings = {
      enable:true,
      toolbars: ["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"],
      zoomFactor: .5,
      maxZoom: 17

    }

    //Provo
    this.centerPosition = {
      latitude: 40.24478630014135,
      longitude: -111.64564335092805
    };
    /*
    this.navigationLineSettings = [
    {
        visible: true,
        color: 'blue',
        width: 5,
        angle: 0.1,
        latitude: [34.06062, 40.724546],
        longitude: [-118.330491, -73.850344]
    }];
    */
  }

  public zoomSettings:object | undefined
  public centerPosition: object | undefined
  public markerSettings: any
  public navigationLineSettings: object | undefined

  public bingKey = "ApscR-2i8TspsYdQ4QtRVWVVaM08wKQF2yozbQ3e_3BUriw0V5a1OJydo_9SPuF9"

  public load = (args: ILoadEventArgs) : void => {

      args?.maps?.getBingUrlTemplate("https://dev.virtualearth.net/REST/V1/Imagery/Metadata/CanvasLight?output=json&uriScheme=https&key=" + this.bingKey).then(function(url) {

        if (args.maps != undefined) {
          args.maps.layers[0].urlTemplate = url
        }

      });

  };

  public hello() {
    return "Hello World"
  }

  public async getOrders() {

    //debugger

    let data = await lastValueFrom(this.http.get<any>(this.getOrdersUrl))

    this.markerSettings = []

    let driverPos = {visible: true, height: 25, width: 15, fill: "green", dataSource: [{latitude: this.startingLat, longitude: this.startingLon, name: "Provo"}]}

    this.markerSettings.push(driverPos)

    //Filter out anything that does not match restaurant
    let filteredData = []

    for (let order of data) {
      let orderRestaurant = order.restaurant.replace(/[^a-z0-9]/gi, '')
      let restaurant = this.restaurant.replace(/[^a-z0-9]/gi, '')

      if (orderRestaurant.toLowerCase() == restaurant.toLowerCase()) {
        filteredData.push(order)
      }
    }

    for (let order of filteredData) {

      this.orders.push(order)

      let newJson = null

      if (order.company.toLowerCase() == "doordash") {
        newJson = {visible: true, height: 25, width: 15, fill: "blue", dataSource: [{latitude: order.latitude, longitude: order.longitude, name: order.name}]}
      }

      if (order.company.toLowerCase() == "uber") {
        newJson = {visible: true, height: 25, width: 15, fill: "black", dataSource: [{latitude: order.latitude, longitude: order.longitude, name: order.name}]}
      }

      if (order.company.toLowerCase() == "grubhub") {
        newJson = {visible: true, height: 25, width: 15, fill: "red", dataSource: [{latitude: order.latitude, longitude: order.longitude, name: order.name}]}
      }

      this.markerSettings.push(newJson)
    }
  }

  public async getDistance(lat1: any, lon1: any, lat2: any, lon2: any) {

    return fetch("http://dev.virtualearth.net/REST/V1/Routes?wp.0=" + lat1 + "," + lon1 + "&wp.1=" + lat2 + "," + lon2 + "&key=" + this.bingKey)
    .then((response) => response.json())
    .then((data) => {
      //Distance - KM
      let distance = data.resourceSets[0].resources[0].routeLegs[0].travelDistance

      //Converts to Minutes
      distance = distance * .621371

      return distance
    });
  }

  public async getTime(lat1: any, lon1: any, lat2: any, lon2: any) {
    return fetch("http://dev.virtualearth.net/REST/V1/Routes?wp.0=" + lat1 + "," + lon1 + "&wp.1=" + lat2 + "," + lon2 + "&key=" + this.bingKey)
    .then((response) => response.json())
    .then((data) => {
      //console.log(data)
      //Time - Seconds
      let time = data.resourceSets[0].resources[0].routeLegs[0].travelDuration

      //Converts to Minutes
      time = time / 60

      console.log("Time: " + time + " minutes")

      return time
    });
  }

  public async getRoute(startLat:any, startLon:any) {
    for (let order of this.orders) {
      let distance = await this.getDistance(startLat, startLon, order.latitude, order.longitude);
      console.log(distance)
      /*
      if (distance < smallestDistance) {
        smallestDistance = distance
      }
      */
    }
  }

}
