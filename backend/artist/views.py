"""
Module for handling API views
"""
from rest_framework import generics, viewsets,status
from .models import Services, User, Customer, Sale, Products, Location
from .serializers import ServiceSerializer, StaffSerializer, CustomerSerializer, SaleSerializer,ProductSerializer,LocationSerializer
from django.db.models import Q
from django.contrib.postgres.search import SearchVector
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class ServiceList(generics.ListAPIView):
    queryset = Services.objects.all()  # Ensure Services model has objects member
    serializer_class = ServiceSerializer

class StaffList(generics.ListAPIView):
    queryset = User.objects.filter(role='STF')
    serializer_class = StaffSerializer



class CustomerSearch(generics.ListCreateAPIView):
    serializer_class = CustomerSerializer

    def get_queryset(self):
        query = self.request.query_params.get('query', None)
        if query:
            vector = SearchVector('first_name', 'last_name', 'mobile')
            search_query = SearchQuery(query)
            queryset = Customer.objects.annotate(search=vector).filter(search=search_query)
            return queryset[:1]  # Return only the first match
        return Customer.objects.none()  # Return an empty queryset if no query
    
    def create(self, request, *args, **kwargs):
        data = request.data
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        mobile = data.get('mobile')
        location_id = data.get('location')

        location = get_object_or_404(Location, id=location_id)

        customer = Customer.objects.create(first_name=first_name, last_name=last_name, mobile=mobile, location=location)
        return Response(self.get_serializer(customer).data, status=status.HTTP_201_CREATED)

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer


class ProductViewSet(generics.ListAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    


class LocationViewSet(generics.ListAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned locations by filtering against
        a `name` query parameter in the URL.
        """
        queryset = Location.objects.all()
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name__iexact=name)
        return queryset