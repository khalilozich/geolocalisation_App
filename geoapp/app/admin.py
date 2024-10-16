from django.contrib import admin
from .models import *
# Register your models here.
class PointAdmin(admin.ModelAdmin):
    list_display =("latitude","longitude")
admin.site.register(Point,PointAdmin)


class RouteAdmin(admin.ModelAdmin):
    list_display = ('id', 'start_point', 'destination_latitude', 'destination_longitude')
    list_filter = ('start_point',)
    search_fields = ('start_point__latitude', 'start_point__longitude', 'destination_latitude', 'destination_longitude')

admin.site.register(Route, RouteAdmin)
