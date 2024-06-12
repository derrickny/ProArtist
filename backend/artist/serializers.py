# serializers.py
from rest_framework import serializers
from django.utils import timezone
from .models import *
from django.utils.dateparse import parse_datetime
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = ['id', 'name', 'description', 'price', 'duration']

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name','role']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'email', 'mobile', 'location']




class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = ['service', 'product', 'quantity', 'price_per_unit', 'discount']

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)

    class Meta:
        model = Sale
        fields = ['sale_id', 'date', 'customer', 'user', 'tip', 'card_payment', 'mpesa_payment', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        sale = Sale.objects.create(**validated_data)
        for item_data in items_data:
            SaleItem.objects.create(sale=sale, **item_data)
        return sale
        
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields =[ 'id', 'name', 'price', ]

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'address']
        



class AppointmentSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    location_name = serializers.SerializerMethodField()
    service_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointments
        fields = ['id', 'customer_name', 'user_name','user_id' ,'location_name', 'service_name', 'date_time', 'status']

    def get_user_id(self, obj):
        return obj.user.id

    def get_customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"

    def get_user_name(self, obj):
        return f"{obj.user.first_name.upper()}"
    
    def get_location_name(self, obj):
        return f"{obj.location.name.upper()}"
    
    def get_service_name(self, obj):
        return f"{obj.service.name.upper()}"
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        date_time = parse_datetime(representation['date_time'])
        representation['date'] = date_time.date().isoformat()
        representation['time'] = date_time.time().strftime('%H:%M')
        del representation['date_time']
        return representation