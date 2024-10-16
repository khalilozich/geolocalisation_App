
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.conf import settings
import googlemaps
from .models import *
from .serializer import *
from rest_framework import generics
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt



class PointViewSet(viewsets.ModelViewSet):
    queryset = Point.objects.all()
    serializer_class = PointSerializer
class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer    
class CustomUserListView(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


 

@csrf_exempt  # Utilisé ici pour simplifier, veillez à utiliser des autorisations appropriées dans un environnement de production.
def delete_point(request, point_id):
    if request.method == 'DELETE':
        try:
            point = Point.objects.get(pk=point_id)
            point.delete()
            return JsonResponse({'message': 'Point supprimé avec succès.'}, status=200)
        except Point.DoesNotExist:
            return JsonResponse({'error': 'Point introuvable.'}, status=404)
    return JsonResponse({'error': 'Méthode non autorisée.'}, status=405)

from django.http import JsonResponse
from .models import Route

def search_routes_by_point(request):
    if 'point_name' in request.GET:
        point_name = request.GET['point_name']
        routes = Route.objects.filter(start_point__nom__icontains=point_name)
        route_data = [
            {
                'start_point': route.start_point.nom,
                'destination_latitude': route.destination_latitude,
                'destination_longitude': route.destination_longitude,
            }
            for route in routes
        ]
        return JsonResponse(route_data, safe=False)
    else:
        return JsonResponse([], safe=False)
