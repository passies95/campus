from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from djgeojson.views import GeoJSONLayerView
# Imports from views and Models
from campusfront.views import CampusMapView

app_name = "campusfront"

urlpatterns = [
    path(
        "", CampusMapView.as_view(), name='mapview'
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)