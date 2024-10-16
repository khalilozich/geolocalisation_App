# Generated by Django 4.2.3 on 2023-07-16 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_remove_point_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='point',
            name='direction',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='point',
            name='nom',
            field=models.CharField(default=10, max_length=100),
            preserve_default=False,
        ),
    ]
