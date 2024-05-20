# serializers.py
from rest_framework import serializers
from .models import Services, User, Customer, SaleItem, Products, Sale, Location

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = ['id', 'name', 'description', 'price', 'duration']

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name']

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