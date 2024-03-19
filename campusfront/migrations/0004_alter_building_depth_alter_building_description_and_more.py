# Generated by Django 4.2.6 on 2024-02-16 07:39

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campusfront', '0003_alter_building_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='building',
            name='depth',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='building',
            name='description',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='building',
            name='entrace',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326),
        ),
        migrations.AlterField(
            model_name='building',
            name='height',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='building',
            name='name',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='building',
            name='no_ofFloors',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='building',
            name='usage',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='otherroom',
            name='roomname',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AlterField(
            model_name='otherroom',
            name='usage',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]
