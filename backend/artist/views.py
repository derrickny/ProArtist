"""
Module for handling API views
"""
from rest_framework import generics
from .models import Services, User, Customer, SaleItem
from .serializers import ServiceSerializer, StaffSerializer, CustomerSerializer, SaleItemSerializer

class ServiceList(generics.ListAPIView):
    queryset = Services.objects.all()  # Ensure Services model has objects member
    serializer_class = ServiceSerializer

class StaffList(generics.ListAPIView):
    queryset = User.objects.filter(role='STF')
    serializer_class = StaffSerializer

class CustomerSearch(generics.ListAPIView):
    serializer_class = CustomerSerializer

    def get_queryset(self):
        queryset = Customer.objects.all()  # Ensure Customer model has objects member
        name = self.request.query_params.get('name', None)
        mobile = self.request.query_params.get('mobile', None)
        customer_id = self.request.query_params.get('id', None)  # Renamed id to customer_id

        if name is not None:
            queryset = queryset.filter(name__icontains=name)
        if mobile is not None:
            queryset = queryset.filter(mobile__icontains=mobile)
        if customer_id is not None:  # Renamed id to customer_id
            queryset = queryset.filter(id=customer_id)

        return queryset

class SaleItemCreate(generics.CreateAPIView):
    queryset = SaleItem.objects.all()  # Ensure SaleItem model has objects member
    serializer_class = SaleItemSerializer