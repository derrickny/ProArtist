# urls.py
from django.urls import path
from .views import ServiceList, StaffList, CustomerSearch, SaleItemCreate

urlpatterns = [
    path('services/', ServiceList.as_view()),
    path('staff/', StaffList.as_view()),
    path('customers/', CustomerSearch.as_view()),
    path('sale-items/', SaleItemCreate.as_view()),
]