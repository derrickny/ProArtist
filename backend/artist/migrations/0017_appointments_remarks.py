# Generated by Django 5.0.6 on 2024-06-13 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artist', '0016_remove_appointments_remarks_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointments',
            name='remarks',
            field=models.TextField(null=True),
        ),
    ]
