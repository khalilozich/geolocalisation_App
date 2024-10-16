from rest_framework import serializers
from .models import *

class PointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Point
        fields = '__all__'


class RouteSerializer(serializers.ModelSerializer):
    start_point = PointSerializer()

    class Meta:
        model = Route
        fields = ('id', 'start_point', 'destination_latitude', 'destination_longitude')

    def create(self, validated_data):
        start_point_data = validated_data.pop('start_point')
        start_point = None

        try:
            start_point = Point.objects.get(latitude=start_point_data['latitude'],
                                            longitude=start_point_data['longitude'])
        except Point.DoesNotExist:
            pass  # Start point doesn't exist, we will not create it here.

        route = Route.objects.create(start_point=start_point, **validated_data)
        return route
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'phone_number')    