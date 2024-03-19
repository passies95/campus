from django.contrib import admin
# Import the LeafletGeoAdmin for use in editing geometry objects in admins site
# Register geom model to use the LeafletGeoAdmin
from leaflet.admin import LeafletGeoAdmin
# Import the classes defined under the model
from campusfront.models import Building, Road, LectureRoom, Office, OtherRoom, School, Department


# Register your models here.
class CampusAdmin(admin.ModelAdmin):
    pass

admin.site.register(Building, LeafletGeoAdmin)
admin.site.register(Road, LeafletGeoAdmin)
admin.site.register(LectureRoom, LeafletGeoAdmin)
admin.site.register(Office, LeafletGeoAdmin)
admin.site.register(OtherRoom, LeafletGeoAdmin)
admin.site.register(School, LeafletGeoAdmin)
admin.site.register(Department, LeafletGeoAdmin)

# from django.contrib import admin
# from leaflet.admin import LeafletGeoAdmin
# from campusfront.models import Building, Road, LectureRoom, Office, OtherRoom, School, Department

# class CustomLeafletGeoAdmin(LeafletGeoAdmin):
#     class Media:
#         # Add the path to your JavaScript file
#         js = (
#             'js/leaflet_custom_layers.js',
#         )

# # Register your models with the custom admin class
# admin.site.register(Building, CustomLeafletGeoAdmin)
# admin.site.register(Road, CustomLeafletGeoAdmin)
# admin.site.register(LectureRoom, CustomLeafletGeoAdmin)
# admin.site.register(Office, CustomLeafletGeoAdmin)
# admin.site.register(OtherRoom, CustomLeafletGeoAdmin)
# admin.site.register(School, CustomLeafletGeoAdmin)
# admin.site.register(Department, CustomLeafletGeoAdmin)
