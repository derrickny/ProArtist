

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
        query = self.request.query_params.get('search', None)
        if query:
            query = query.strip()  # Trim the query

            # Check if the query is a number (ID)
            if query.isdigit():
                return Customer.objects.filter(id=int(query))  # Return customers with matching ID

            # If the query is not a number, convert it to uppercase and perform a string-based search
            query = query.upper()
            queryset = Customer.objects.filter(
                Q(first_name__icontains=query) | 
                Q(last_name__icontains=query) |
                Q(mobile__icontains=query)
            )
            return queryset[:1]  # Return only the first match

        return Customer.objects.none()  # Return an empty queryset if no query # Return an empty queryset if no query # Return an empty queryset if no query
    
    def create(self, request, *args, **kwargs):
        data = request.data
        first_name = data.get('first_name').strip().upper()
        last_name = data.get('last_name').strip().upper() if data.get('last_name') else None
        mobile = data.get('mobile').strip()
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