# Import utilities
import os
from django.contrib.gis.utils import LayerMapping

# Import the target model
from campusfront.models import Building

building_mapping = {
    'bldid': 'id',
    'name': 'name',
    'usage': 'usage',
    'depth': 'depth',
    'no_ofFloors': 'floors',
    'height': 'height',
    'description': 'descriptio',
    'geom': 'POLYGON',
}

# building_path = os.path.join("D:\DEV","FGS6221","campus","data","UON_Buildings.shp")
building_path = "D:\\DEV\\FGS6221\\campus\\data\\UON_Buildings.shp"
print(building_path)
def importData(verbose=True):
    lm = LayerMapping(Building, building_path, building_mapping, transform=False,encoding='utf-8' )
    lm.save(strict=True,verbose=True)

