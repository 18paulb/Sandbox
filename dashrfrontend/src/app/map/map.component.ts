import { Component, OnInit, Inject, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

import { Maps, Zoom, ILoadEventArgs, Marker, NavigationLine } from '@syncfusion/ej2-angular-maps';
import {world_map} from './world-map'

import { Injectable } from '@angular/core';
import { HttpBackend, HttpParams, HttpClient } from '@angular/common/http';
import { last, lastValueFrom } from 'rxjs';

Maps.Inject(Zoom, Marker, NavigationLine)
@Injectable()
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class MapComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public registerOrderUrl = "http://localhost:8000/register"
  public getOrdersUrl = "http://localhost:8000/orders"

  public bindLatitude = ""
  public bindLongitude = ""
  public bindName = ""
  public bindCompany = ""
  public bindPrice = ""
  public bindRestaurant = ""

  public startingLat = 40.235728
  public startingLon = -111.653169

  public orders: JSON | undefined

  ngOnInit(): void {

    this.getOrders()

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

  public shapeData: object = world_map
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

  public async getOrders() {

    let data = await lastValueFrom(this.http.get<any>(this.getOrdersUrl))

    this.markerSettings = []

    let driverPos = {visible: true, height: 25, width: 15, fill: "green", dataSource: [{latitude: this.startingLat, longitude: this.startingLon, name: "Provo"}]}
    this.markerSettings.push(driverPos)

    for (let order of data) {

      console.log(order)

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

  public registerOrder() {

    if (this.bindLatitude == "" || this.bindLongitude == "") {
      return
    }

    let data = {latitude: this.bindLatitude, longitude: this.bindLongitude, name: this.bindName,
      company: this.bindCompany, price: this.bindPrice, restaurant: this.bindRestaurant}

    this.http.post<any>(this.registerOrderUrl, data)
      .subscribe(res => console.log(res))

    this.bindLatitude = ""
    this.bindLongitude = ""
    this.bindName = ""
    this.bindCompany = ""
    this.bindPrice = ""
    this.bindRestaurant = ""
  }
}
