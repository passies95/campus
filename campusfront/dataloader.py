# Import utilities
import os
from django.contrib.gis.utils import LayerMapping

# Import the target model
from campusfront.models import Building

building_mapping = {
    'bldid': 'bldid',
    'name': 'name',
    'usage': 'usage',
    'depth': 'depth',
    'no_ofFloors': 'no_ofFloor',
    'height': 'height',
    'description': 'descriptio',
    'geom': 'POLYGON',
    'entrace': 'entrace',
}

# building_path = os.path.join("D:\DEV","FGS6221","campus","data","UON_Buildings.shp")
building_path = "D:\\DEV\\FGS6221\\campus\\data\\UON_Buildings.shp"
print(building_path)
def importData(verbose=True):
    lm = LayerMapping(Building, building_path, building_mapping, transform=False,encoding='utf-8' )
    lm.save(strict=True,verbose=True)

# import geopandas as gpd
# from .models import Building

# # Load spatial data into a GeoDataFrame
# building_path = "D:\\DEV\\FGS6221\\campus\\data\\UON_Buildings.shp"
# gdf = gpd.read_file(building_path)

# for index, row in gdf.iterrows():
#     # Create an instance of MyModel
#     my_model_instance = Building(
#         bldid=row['bldid'],
#         name=row['name'],
#         usage=row['usage'],
#         depth=row['depth'],
#         no_ofFloors=row['no_ofFloor'],
#         height=row['height'],
#         description=row['descriptio'],
#         geom=row['POLYGON'],  # Assuming 'POLYGON' is the name of the geometry field representing the polygon
#         entrace=row['entrace']  # Assuming 'entrace' is the attribute storing the center point
#     )
#     # Save the instance to the database
#     my_model_instance.save()
