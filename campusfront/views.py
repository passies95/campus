import json
from django.core.serializers import serialize
from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.templatetags.static import static


# Import all the models defined in the models.py file
from campusfront.models import Building, Road, LectureRoom, Office, OtherRoom, Department, School

# Create your views here.

class CampusMapView(TemplateView):
    template_name = "campusmap.html"

    def get_context_data(self, **kwargs):
        context =  super().get_context_data(**kwargs)

        # Serialize the buildings
        buildings = Building.objects.all()
        building_geojson = serialize("geojson", buildings, geometry_field='geom') # pass the geom field for correct serialization
        context["buildings"] = json.loads(building_geojson)

        # serialize the schools
        schools = School.objects.all()
        school_geojson = serialize("geojson", schools, geometry_field='geom') # pass the geom field for correct serialization
        context["schools"] = json.loads(school_geojson)

        # Serialize departments and their related school information
        departments = Department.objects.prefetch_related('schoolID').all()
        departments_geojson = serialize("geojson", departments)
        context["departments"] = json.loads(departments_geojson)
        return context
