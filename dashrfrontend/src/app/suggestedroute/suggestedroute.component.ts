import { Component, OnInit, Inject, Input } from '@angular/core';


import { Maps, Zoom, ILoadEventArgs, Marker, NavigationLine } from '@syncfusion/ej2-angular-maps';
import { Injectable } from '@angular/core';
import { HttpBackend, HttpParams, HttpClient } from '@angular/common/http';
import { last, lastValueFrom } from 'rxjs';

Maps.Inject(Zoom, Marker, NavigationLine)
@Injectable()
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

  public wendysLat = 40.240365
  public wendysLon = -111.646407

  public orders:any = []

  public route:any = []

  public predictedEarnings = 0
  public predictedTime = 0
  public distanceTravelled = 0

  ngOnInit(): void {

    this.getOrders()

    //this.helperGetRoute(this.startingLat, this.startingLon, this.orders)

    //this.makeLines()

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

    this.navigationLineSettings = [
      /*
    {
        visible: true,
        color: 'blue',
        width: 5,
        angle: 0.1,
        latitude: [34.06062, 40.724546],
        longitude: [-118.330491, -73.850344]
    },
    */
    {
      visible: true,
      color: 'blue',
      width: 5,
      angle: 0.1,
      latitude: [40.235728, 40.250437],
      longitude: [-111.653169, -111.656065]
    },
    {
      visible: true,
      color: 'blue',
      width: 5,
      angle: 0.1,
      latitude: [40.250437, 40.254631],
      longitude: [-111.656065, -111.658409]
    },
    {
      visible: true,
      color: 'blue',
      width: 5,
      angle: 0.1,
      latitude: [40.254631, 40.244261],
      longitude: [-111.658409, -111.643687]
    },
    {
      visible: true,
      color: 'blue',
      width: 5,
      angle: 0.1,
      latitude: [40.244261, 40.244474],
      longitude: [-111.645321, -111.645321]
    },
    {
      visible: true,
      color: 'blue',
      width: 5,
      angle: 0.1,
      latitude: [40.244474, 40.271862],
      longitude: [-111.645321, -111.697146]
    },
  ];

  }

  public zoomSettings:object | undefined
  public centerPosition: object | undefined
  public markerSettings: any
  public navigationLineSettings: any

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

  public makeLines() {
    for (let i = 0; i < this.route.length; ++i) {
      if (i + 1 == this.route.length) {
        break;
      }

      let startLat = this.route[i][0]
      let startLon = this.route[i][1]
      let endLat = this.route[i + 1][0]
      let endLon = this.route[i + 1][1]

      this.navigationLineSettings.push({
        visible: true,
        color: 'blue',
        width: 2,
        angle: 0.1,
        latitude: [startLat, endLat],
        longitude: [startLon, endLon]
      })
    }
  }

  public async helperGetRoute(startLat:any, startLon:any, ordersLeft:any[]) {

    this.route.push([startLat, startLon])
    this.route.push([this.wendysLat, this.wendysLon])

    let tmpTime = await this.getTime(startLat, startLon, this.wendysLat, this.wendysLon)
    let distance = await this.getDistance(startLat, startLon, this.wendysLat, this.wendysLon);

    this.predictedTime += tmpTime
    this.distanceTravelled += distance

    //debugger

    await this.getRoute(this.wendysLat, this.wendysLon, ordersLeft)

    //Draw Lines

    console.log("Final Route: ", this.route)

    debugger

    // this.navigationLineSettings = []
/*
    for (let i = 0; i < this.route.length; ++i) {
      if (i + 1 == this.route.length) {
        break;
      }

      let startLat = this.route[i][0]
      let startLon = this.route[i][1]
      let endLat = this.route[i + 1][0]
      let endLon = this.route[i + 1][1]

      //let newJson = {visible: true, color: 'blue', width: 5, angle: .1, latitude: [startLat, endLat], longitude: [startLon, endLon]}
      //this.navigationLineSettings.push(newJson)

      this.navigationLineSettings.push({
        visible: true,
        color: 'blue',
        width: 2,
        angle: 0.1,
        latitude: [startLat, endLat],
        longitude: [startLon, endLon]
      })

      console.log("Navigation: " + this.navigationLineSettings)
    }
    */

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

      return time
    });
  }

  public async getRoute(startLat:any, startLon:any, ordersLeft:any[]) {

    if (ordersLeft.length == 0) {
      return
    }

    let smallestDistance = 100
    let closestOrder = ordersLeft[0]

    for (let order of ordersLeft) {
      let distance = await this.getDistance(startLat, startLon, order.latitude, order.longitude);
      //console.log(distance)
      if (distance < smallestDistance) {
        closestOrder = order
        smallestDistance = distance
      }
    }

    //debugger

    let tmpTime = await this.getTime(startLat, startLon, closestOrder.latitude, closestOrder.longitude)

    this.distanceTravelled = Math.round(((this.distanceTravelled + smallestDistance) * 10) / 10)
    this.predictedEarnings = Math.round(((this.predictedEarnings + closestOrder.price) * 100) / 100)
    this.predictedTime = Math.round(this.predictedTime + tmpTime)

    for (let i = 0; i < ordersLeft.length; ++i) {
      if (ordersLeft[i].orderID == closestOrder.orderID) {
        ordersLeft.splice(i,1)
        break

      }
    }

    //We have smallest distance
    this.route.push([closestOrder.latitude, closestOrder.longitude])
    console.log("Route: ", this.route)

    await this.getRoute(closestOrder.latitude, closestOrder.longitude, ordersLeft)
  }

}
