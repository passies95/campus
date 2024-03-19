from django.db import models
from django.contrib.gis.db import models as gismodels
from django.contrib.auth.models import User

"""
A class to define and store buildings at the campus
The class will store building attributes as defined below
    bldid : (int) Building Identification Number
    name : (str) Building Name
    usage : The various uses of the building
    entrace : (point) Store the point of the entrace to be used for navigation
"""
class Building(gismodels.Model):
    bldid = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=256, null=True, blank=True)
    usage = models.CharField(max_length=256, null=True, blank=True)
    description = models.CharField(max_length=256, null=True, blank=True)
    no_ofFloors = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    depth = models.IntegerField(null=True, blank=True)
    entrace = gismodels.PointField(null=True, blank=True)
    photo = models.ImageField(upload_to='photos', null=True, blank=True)
    geom = gismodels.PolygonField()

class School(models.Model):
    schoolID = models.IntegerField(unique=True)
    name = models.CharField(max_length=256)
    geom = gismodels.GeometryField(null=True, blank=True)

    class Meta:
         verbose_name_plural = 'Schools'

class Department(models.Model):
    departmentID = models.IntegerField(unique=True)
    name = models.CharField(max_length=256)
    schoolID = models.ForeignKey(
        to=School,
        on_delete=models.CASCADE,
        db_index=True,
        null=True
    )

    class Meta:
         verbose_name_plural = 'Departments'

class LectureRoom(models.Model):
    lectureRoomID = models.IntegerField(primary_key=True)
    buildingID = models.ForeignKey(
        to=Building,
        on_delete=models.CASCADE,
        db_index=True
    )
    roomName = models.CharField(max_length=10)

class Office(models.Model):
    officeID = models.IntegerField(primary_key=True)
    buildingID = models.ForeignKey(
        to=Building,
        on_delete=models.CASCADE,
        db_index=True
    )
    officename = models.CharField(max_length=256)

class OtherRoom(models.Model):
    roomID = models.IntegerField(primary_key=True)
    buildingID = models.ForeignKey(
        to=Building,
        on_delete=models.CASCADE,
        db_index=True
    )
    roomname = models.CharField(max_length=256, null=True, blank=True)
    usage = models.CharField(max_length=256, null=True, blank=True)
    availability = models.BooleanField(default=True)

class Road(models.Model):
    roadID = models.IntegerField(primary_key=True)
    geom = gismodels.LineStringField()
    restrictions = models.CharField(max_length=256, blank=True, null=True)

# class OnCampusEvent(models.Model):
#     eventID = models.IntegerField(primary_key=True)
#     buildingID = models.ForeignKey(
#         to=Building,
#         on_delete=models.CASCADE,
#         db_index=True
#     )
#     roomID = models.ForeignKey(
#         to=OtherRoom,
#         on_delete=models.CASCADE,
#         db_index=True
#     )
#     lectureRoomID = models.ForeignKey(
#         to=LectureRoom,
#         on_delete=models.CASCADE,
#         db_index=True
#     )
#     eventname = models.CharField(max_length=256)
#     eventDescription = models.CharField(max_length=256)
#     eventDate = models.DateField()

# class BookRoom(models.Model):
#     date = models.DateField()
#     buildingID = models.ForeignKey(
#         to=Building,
#         on_delete=models.CASCADE,
#         db_index=True
#     )
#     roomID = models.ForeignKey(
#         to=OtherRoom,
#         on_delete=models.CASCADE,
#         db_index=True
#     )
#     lectureRoomID = models.ForeignKey(
#         to=LectureRoom,
#         on_delete=models.CASCADE,
#         db_index=True
#     )
#     booked_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)