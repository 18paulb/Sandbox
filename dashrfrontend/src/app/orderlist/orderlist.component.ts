import { Component, OnInit } from '@angular/core';
import { HttpBackend, HttpParams, HttpClient } from '@angular/common/http';
import { last, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css']
})
export class OrderlistComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getOrders()
  }

  public getOrdersUrl = "http://localhost:8000/orders"

  public uberOrders:any = []
  public doordashOrders:any = []
  public grubhubOrders:any = []

  public async getOrders() {

    let data = await lastValueFrom(this.http.get<any>(this.getOrdersUrl))

    for (let order of data) {

      if (order.company.toLowerCase() == "uber") {
        this.uberOrders.push(order)
      }

      else if (order.company.toLowerCase() == "doordash") {
        this.doordashOrders.push(order)
      }

      else if (order.company.toLowerCase() == "grubhub") {
        this.grubhubOrders.push(order)
      }
    }
  }
}
