# Generated by Django 4.2.3 on 2023-07-18 23:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_alter_route_destination_point'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='route',
            name='destination_point',
        ),
        migrations.AddField(
            model_name='route',
            name='destination_latitude',
            field=models.FloatField(default=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='route',
            name='destination_longitude',
            field=models.FloatField(default=1),
            preserve_default=False,
        ),
    ]
