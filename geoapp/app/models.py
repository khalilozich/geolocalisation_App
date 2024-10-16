# models.py

from django.db import models


class Point(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    nom = models.CharField(max_length=255)  # Add the 'nom' field

    def __str__(self):
        return f"({self.latitude}, {self.longitude}, {self.nom})"
class Route(models.Model):
    start_point = models.ForeignKey(Point, related_name='start_routes', on_delete=models.CASCADE)
    destination_latitude = models.FloatField()
    destination_longitude = models.FloatField()

    def __str__(self):
        return f"Route from {self.start_point} to ({self.destination_latitude}, {self.destination_longitude})"


from django.db import models
from django.contrib.auth.models import UserManager

class CustomUser(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=15, blank=True)

    objects = UserManager()

    def __str__(self):
        return self.username
