from django.shortcuts import render
import json

import string, random

from django.http import HttpResponse
from .models import Order
# Create your views here.
def hello(request):
    return 0


def get_orders(request):
    try:
        if request.method == "GET":
            all_orders = Order.objects.values()
            all_orders = list(all_orders)

        return HttpResponse(json.dumps(all_orders), status=200)

    except Exception as e:
        print(e)
        return HttpResponse(e, status=400)

def register_order(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            letters = string.digits
            id = ''.join(random.choice(letters) for i in range(10))
            latitude = data.get("latitude")
            longitude = data.get('longitude')
            name = data.get('name')
            company = data.get('company')
            price = data.get('price')

            Order.objects.create(orderID=id, latitude=float(latitude), longitude=float(longitude),
                name=name, company=company, price=float(price))

            print("Order successfully created")

            return HttpResponse(status=200)

    except Exception as e:
        print(e)
        return HttpResponse(e, status=400)