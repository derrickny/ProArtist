from django.contrib.auth.models import AbstractUser
from django.db import models
from pydantic import ValidationError



class User(AbstractUser):
    ROLE_CHOICES = [('ADM', 'Admin'), ('STF', 'Staff'), ('MNG', 'Manager')]
    role = models.CharField(max_length=3, choices=ROLE_CHOICES)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL ,null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=20)
    total_visits = models.IntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_visit_date = models.DateField(null=True, blank=True)



class Services(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField()

class Products(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True)

class Sales(models.Model):
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)
    location = models.ForeignKey('Location', on_delete=models.CASCADE)
    date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

class SaleItem(models.Model):
    sale_id = models.CharField(max_length=20, unique=True)
    date = models.DateField(auto_now_add=True)
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)
    service = models.ForeignKey('Services', on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    tip = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    card_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    mpesa_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    @property
    def sub_total(self):
        return self.quantity * self.price_per_unit

    @property
    def grand_total(self):
        return self.sub_total - self.discount + self.tip
    

class Appointments(models.Model):
    STATUS_CHOICES = [('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled'), ('No Show', 'No Show')]
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    service = models.ForeignKey('Services', on_delete=models.CASCADE)
    location = models.ForeignKey('Location', on_delete=models.CASCADE)
    date_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    remarks = models.TextField()

class ResourceCredits(models.Model):
    TYPE_CHOICES = [('SMS', 'SMS'), ('WhatsApp', 'WhatsApp')]
    network = models.ForeignKey('Network', on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    total_credits = models.IntegerField()
    remaining_credits = models.IntegerField()

    def clean(self):
        if not (self.network is None) ^ (self.location is None):
            raise ValidationError('Either network or location must be set, but not both.')

class Memberships(models.Model):
    sold_at_location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True)
    valid_locations = models.TextField()

class GiftVouchers(models.Model):
    issued_by_location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True)
    redeemable_at_locations = models.TextField()

class CustomerSegments(models.Model):
    segment_name = models.CharField(max_length=255)
    criteria = models.TextField()

class CustomerSegmentMapping(models.Model):
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)
    segment = models.ForeignKey('CustomerSegments', on_delete=models.CASCADE)

class Campaigns(models.Model):
    segment = models.ForeignKey('CustomerSegments', on_delete=models.CASCADE)
    campaign_name = models.CharField(max_length=255)
    message = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()

class Integrations(models.Model):
    TYPE_CHOICES = [('WhatsApp', 'WhatsApp'), ('SMS', 'SMS'), ('Payment Gateway', 'Payment Gateway'), ('Quick Books', 'Quick Books'), ('Mailchimp', 'Mailchimp')]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    details = models.TextField()

class Location(models.Model):
    network = models.ForeignKey('Network', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)

class Network(models.Model):
    name = models.CharField(max_length=255)

# ... and so on for the other models ...