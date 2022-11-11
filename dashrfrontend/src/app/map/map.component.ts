import { Component, OnInit, Inject, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

import { Maps, Zoom, ILoadEventArgs, Marker, NavigationLine } from '@syncfusion/ej2-angular-maps';
import {world_map} from './world-map'

import { Injectable } from '@angular/core';
import { HttpBackend, HttpParams, HttpClient } from '@angular/common/http';

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

  public orders: object | undefined

  ngOnInit(): void {
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

    this.markerSettings = [
      {
        visible: true,
        height: 25,
        width: 15,
        dataSource: [
          {
            latitude: 34.06062,
            longitude: -118.330491,
            name: 'California'
          },
          {
            latitude: 40.724546,
            longitude: -73.850344,
            name: 'New York'
          }
        ]
      }
    ];

    this.navigationLineSettings = [
    {
        visible: true,
        color: 'blue',
        width: 5,
        angle: 0.1,
        latitude: [34.06062, 40.724546],
        longitude: [-118.330491, -73.850344]
    }];
  }

  public shapeData: object = world_map
  public zoomSettings:object | undefined
  public centerPosition: object | undefined
  public markerSettings: object | undefined
  public navigationLineSettings: object | undefined

  public bingKey = "ApscR-2i8TspsYdQ4QtRVWVVaM08wKQF2yozbQ3e_3BUriw0V5a1OJydo_9SPuF9"

  public load = (args: ILoadEventArgs) : void => {

      args?.maps?.getBingUrlTemplate("https://dev.virtualearth.net/REST/V1/Imagery/Metadata/CanvasLight?output=json&uriScheme=https&key=" + this.bingKey).then(function(url) {

        if (args.maps != undefined) {
          args.maps.layers[0].urlTemplate = url
        }

      });

  };

  public getOrders() {

    let tmpOrders:any = []

    debugger

    this.http.get<any>(this.getOrdersUrl)
      .subscribe(res => {
        console.log(res)
        tmpOrders = res
      })

    for (let order of tmpOrders) {
      console.log(order)
    }

  }


  public registerOrder() {
    /*
    let params = new HttpParams()

    params.append("latitude", this.bindLatitude)
    params.append("longitude", this.bindLongitude)
    params.append("name", this.bindName)
    params.append("company", this.bindCompany)
    params.append("price", this.bindPrice)
    */

    let data = {latitude: this.bindLatitude, longitude: this.bindLongitude, name: this.bindName,
      company: this.bindCompany, price: this.bindPrice}

    this.http.post<any>(this.registerOrderUrl, data)
      .subscribe(res => console.log(res))


    this.bindLatitude = ""
    this.bindLongitude = ""
    this.bindName = ""
    this.bindCompany = ""
    this.bindPrice = ""
  }

}
