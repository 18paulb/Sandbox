from django.db import models

# Create your models here.
class Order(models.Model):
    orderID = models.CharField(max_length=255, blank=False, default=None, primary_key=True)
    name = models.CharField(max_length=255, blank=False, default=None)
    company = models.CharField(max_length=255, blank=False, default=None)
    latitude = models.FloatField(blank=False, default=None)
    longitude = models.FloatField(blank=False, default=None)
    price = models.FloatField(blank=False, default=None)
    #restaurant = models.CharField(max_length=255, default=None)

    def __str__(self):
        return self.company + " Order: " + self.name + " for $" + str(self.price)