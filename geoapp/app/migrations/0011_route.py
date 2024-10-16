# Generated by Django 4.2.3 on 2023-07-17 19:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_remove_point_direction_remove_point_nom'),
    ]

    operations = [
        migrations.CreateModel(
            name='Route',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('distance', models.CharField(max_length=100)),
                ('duration', models.CharField(max_length=100)),
                ('destination_point', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='destination_routes', to='app.point')),
                ('start_point', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='start_routes', to='app.point')),
            ],
        ),
    ]
