from django.shortcuts import render
import json

from django.http import HttpResponse
from .models import Order
# Create your views here.
def hello(request):
    return 0


def get_orders(request):
    try:
        if request.method == "POST":
            print(request)

    except Exception as e:
        print(e)
        return HttpResponse(e, status=400)