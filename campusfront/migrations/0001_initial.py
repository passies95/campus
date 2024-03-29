# Generated by Django 4.2.6 on 2024-02-13 20:27

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('bldid', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=256)),
                ('usage', models.CharField(max_length=256)),
                ('description', models.CharField(max_length=256)),
                ('no_ofFloors', models.IntegerField()),
                ('height', models.IntegerField()),
                ('depth', models.IntegerField()),
                ('entrace', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='uploads')),
                ('geom', django.contrib.gis.db.models.fields.PolygonField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('departmentID', models.IntegerField(unique=True)),
                ('name', models.CharField(max_length=256)),
            ],
            options={
                'verbose_name_plural': 'Departments',
            },
        ),
        migrations.CreateModel(
            name='Road',
            fields=[
                ('roadID', models.IntegerField(primary_key=True, serialize=False)),
                ('geom', django.contrib.gis.db.models.fields.LineStringField(srid=4326)),
                ('restrictions', models.CharField(blank=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('schoolID', models.IntegerField(unique=True)),
                ('name', models.CharField(max_length=256)),
            ],
            options={
                'verbose_name_plural': 'Schools',
            },
        ),
        migrations.CreateModel(
            name='OtherRoom',
            fields=[
                ('roomID', models.IntegerField(primary_key=True, serialize=False)),
                ('roomname', models.CharField(max_length=256)),
                ('usage', models.CharField(max_length=256)),
                ('availability', models.BooleanField(default=True)),
                ('buildingID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='campusfront.building')),
            ],
        ),
        migrations.CreateModel(
            name='Office',
            fields=[
                ('officeID', models.IntegerField(primary_key=True, serialize=False)),
                ('officename', models.CharField(max_length=256)),
                ('buildingID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='campusfront.building')),
            ],
        ),
        migrations.CreateModel(
            name='LectureRoom',
            fields=[
                ('lectureRoomID', models.IntegerField(primary_key=True, serialize=False)),
                ('roomName', models.CharField(max_length=10)),
                ('buildingID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='campusfront.building')),
            ],
        ),
    ]
