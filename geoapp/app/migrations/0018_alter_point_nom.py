# Generated by Django 4.2.3 on 2023-09-05 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_customuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='point',
            name='nom',
            field=models.CharField(max_length=255),
        ),
    ]
