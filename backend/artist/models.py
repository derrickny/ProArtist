from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator

class User(AbstractUser):
    ROLE_CHOICES = [('Admin', 'Admin'), ('Staff', 'Staff')]
    role = models.CharField(max_length=5, choices=ROLE_CHOICES)

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=20)
    total_visits = models.IntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_visit_date = models.DateField(null=True, blank=True)

class Staff(models.Model):
    ROLE_CHOICES = [('Admin', 'Admin'), ('Staff', 'Staff'), ('Technician', 'Technician')]
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=20)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True)

# ... and so on for the other models ...

class Location(models.Model):
    network = models.ForeignKey('Network', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)

class Network(models.Model):
    name = models.CharField(max_length=255)

# ... and so on for the other models ...