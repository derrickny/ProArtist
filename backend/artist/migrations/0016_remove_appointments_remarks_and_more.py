# Generated by Django 5.0.6 on 2024-06-13 21:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artist', '0015_remove_location_location_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appointments',
            name='remarks',
        ),
        migrations.AlterField(
            model_name='appointments',
            name='status',
            field=models.CharField(choices=[('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled'), ('No Show', 'No Show'), ('New In-App Booking', 'New In-App Booking'), ('New Online Booking', 'New Online Booking'), ('Arrived', 'Arrived'), ('Started', 'Started')], max_length=20),
        ),
    ]
