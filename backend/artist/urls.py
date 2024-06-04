# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'sales', SaleViewSet, basename='sales')

urlpatterns = [
    path('services/', ServiceList.as_view()),
    path('staff/', StaffList.as_view()),
    path('customers/', CustomerSearch.as_view()),
    path('products/', ProductViewSet.as_view()),
    path('locations/', LocationViewSet.as_view()),
    path('appointments/', AppointmentView.as_view()),
    path('', include(router.urls)),
]