# Generated by Django 4.2.3 on 2023-07-18 21:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_alter_route_destination_point'),
    ]

    operations = [
        migrations.AlterField(
            model_name='route',
            name='destination_point',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='destination_routes', to='app.point'),
        ),
    ]
