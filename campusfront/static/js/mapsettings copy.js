// Add a function to initialize the map
// During initilization use the ParseGeoraster method to add a local high resolution imagey into the map
// Equally Add as an overlay, allowing the image to be toggled on and off
// Constants
const API_KEY  = '3A9BRVqaxuV6mvPuJQPM';
const mediaURL = '/media/'
const GEOTIFF_FILE_PATH  = "static/basemap/UON_KE_Nairobi_19Q2_V0_R4C5_cog.tif";

// MapTiler layer initialization
const maptilerLayer = L.maptilerLayer({
    apiKey: API_KEY ,
    //style: L.MaptilerStyle.BACKDROP.DARK,
    // style: L.MaptilerStyle.STREETS, //optional
});

const cartocdnLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
})

// Function for map initialization
function map_initialization (map, options) {

    // Change the controls to the bottom right to prevent from being hidden by the search bar
    map.zoomControl.setPosition('bottomright');

    // Adjust the position of Layer Control below the search bar
    let layerControl;
    const searchbarElement = document.querySelector('.searchbar');
    const searchbarHeight = searchbarElement ? searchbarElement.clientHeight : 0;
    if (layerControl) {
        layerControl.getContainer().style.position = 'absolute';
        layerControl.getContainer().style.top = `${searchbarHeight + 10}px`; // Move it 10px below the bottom of the searchbar
        layerControl.getContainer().style.right = '5px'; // Adjust the value as needed
    }

    // Enable and Start continuous GPS tracking
    // map.locate({
    //     watch: true,  // Enable continuous tracking
    //     enableHighAccuracy: true,  // Use high accuracy if available
    // });

    // // Listen for locationfound event to handle continuous tracking
    // map.on('locationfound', function (e) {
    //     // Retrieve the user's current location using the e.latlng
    //     console.log('User location:', e.latlng);
    //     // Use the location for further processing, such as routing
    // });

    // Add the Datasets to the Map
    // Create a LayerGroup to hold the building features
    const dataLayerGroup = L.layerGroup();

    // Retrieve the buildings, schools data that was added to html using the json script method
    const building_data = document.getElementById("buildings-data");
    const schools_data = document.getElementById("schools-data");
    // const departments_data = document.getElementById("departments-data");
    // console.log(departments_data)

    // Check if the building data is present
    if (building_data) {
        // Parse the GeoJSON data
        const parsedBuildingData = JSON.parse(building_data.textContent);

        // Log the parsed data to the console to verify
        console.log(parsedBuildingData);

        // Add GeoJSON layers to the map
        var building_feature = L.geoJSON(parsedBuildingData, {
            style: function(feature){
                var type = feature.properties.usage;
                if (type === 'Multipurpose'){
                    return {color: 'blue',
                            fillColor: 'blue',
                            fillOpacity: 0.2,}
                } else {
                    return {color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.2,}
                }
            },
            onEachFeature: function (feature, layer) {
                // Add Layer popups by defining the content to display on popup
                const feature_properties = feature.properties
                const imagePath = feature_properties.photo;
                const staticUrl = mediaURL + imagePath;
                // Define the popup content
                const feature_content = `
                <h3>${feature_properties.name}</h3>
                <img width="300" height="200" src="${ staticUrl}"/>
                <h3>Usage: ${feature_properties.usage}</h3>
                <p>${feature_properties.description}</p>
                <h3>ID: ${feature.id}</p>
                `;

                // Set the maximum width to resize the popup based on the device size
                const maxWidth = window.innerWidth > 768 ? 400 : 200;

                // Add popup to map using the bindpopup method
                layer.bindPopup(feature_content);

                // Add a custom property to the layer to usef or later referencing
                layer.layerName = 'Building';
            },
        })
        dataLayerGroup.addLayer(building_feature);
    } else {
        console.error("Building data not found.");
    }

    // Add the Schools Data
    // Check if the building data is present
    if (schools_data) {
        // Parse the GeoJSON data
        const parsedSchoolsData = JSON.parse(schools_data.textContent);

        // Log the parsed data to the console to verify
        console.log(parsedSchoolsData);

        // Add GeoJSON layers to the map
        var schools_feature = L.geoJSON(parsedSchoolsData, {
            style: {
                color: 'red',
                // fillColor: 'blue',
                // fillOpacity: 0.2,
            },
            onEachFeature: function (feature, layer) {
                // Add Layer popups by defining the content to display on popup
                const feature_properties = feature.properties
                // Define the popup content
                const feature_content = `
                <h3>School of ${feature_properties.name}</h3>
                <h3>ID: ${feature.id}</p>
                `;

                // Set the maximum width to resize the popup based on the device size
                const maxWidth = window.innerWidth > 768 ? 400 : 200;

                // Add popup to map using the bindpopup method
                layer.bindPopup(feature_content);

                // Add a custom property to the layer to usef or later referencing
                layer.layerName = 'Schools';
            },
        })//.addTo(map);
        dataLayerGroup.addLayer(schools_feature);
    } else {
        console.error("Schools data not found.");
    }

    // Add the LayerGroup to the map
    dataLayerGroup.addTo(map);

    // Add Search Functionality
    if (typeof L.Control.Search !== 'undefined') {
        console.log('Leaflet Search plugin is loaded successfully.');
        // Using the L.Control.Search plugin and passing the output to the searchbar div
        // Define a layer search
        var searchControl = new L.Control.Search({
            container: 'searchbar', 
            layer: dataLayerGroup,
            // layer: building_feature,
            // Define property to use for searching
            propertyName:'name', 
            initial: false,
            collapsed: false,
            zoom:20,
            textErr:'No match found. Try a different search e.g AW402',
            textPlaceholder:'Search here..e.g Building, School name',
            buildTip: function(text, val) {
                var type = val.layer.layerName;
                // console.log(val)
                return '<a href="#" class="'+type+'">'+text+'<b>'+type+'</b></a>';
            }
        });
        map.addControl(searchControl);
    } else {
        console.error('Leaflet Search plugin is not loaded.');
    }

    // // Create an object to hold the base layers
    // const baseLayers = {
    //     Carto : cartocdnLayer.addTo(map)
    //     // "Basic": maptilerLayer.addTo(map),
    // };
    // Load a custom map tile for the maptiler 
    //maptilerLayer.addTo(map);

    // Fetch and Display custom basemap of the university
    // fetch(GEOTIFF_FILE_PATH )
    //     .then(response => response.arrayBuffer())
    //     .then(arrayBuffer => {
    //         parseGeoraster(arrayBuffer).then(georaster => {
    //         console.log("georaster:", georaster);

    //         const campusHighResBasemap = new GeoRasterLayer({
    //             attribution: "Maxar Technologies",
    //             georaster: georaster,
    //             opacity: 10,
    //             // Higher resolution values improve the rendered image quality however they increase the response time
    //             // Resolution is defined as 64, 128, 256, 512
    //             resolution: 512,
    //             // pixelValuesToColorFn: values => values[0] === 42 ? '#ffffff' : '#000000',
    //         });
    //         // Add GeoRasterLayer to the base layers object
    //         baseLayers["Satellite"] = campusHighResBasemap.addTo(map);

    //         // Create and add layer control to the map outside the fetch block
    //         layerControl = L.control.layers(null, baseLayers, { position: 'topright' }).addTo(map);

    //         map.fitBounds(campusHighResBasemap.getBounds());

    //         // Adjust the position of Layer Control below the search bar
    //         const searchbarElement = document.querySelector('.searchbar');
    //         const searchbarHeight = searchbarElement ? searchbarElement.clientHeight : 0;
    //         layerControl.getContainer().style.position = 'absolute';
    //         layerControl.getContainer().style.top = `${searchbarHeight + 10}px`; // Move it 10px below the bottom of the searchbar
    //         layerControl.getContainer().style.right = '5px'; // Adjust the value as needed

    //     });
    // });

    const campusHighResBasemapPromise = fetch(GEOTIFF_FILE_PATH)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => parseGeoraster(arrayBuffer))
    .then(georaster => {
        console.log("georaster:", georaster);

        const campusHighResBasemap = new GeoRasterLayer({
            attribution: "Maxar Technologies",
            georaster: georaster,
            opacity: 10,
            // Higher resolution values improve the rendered image quality however they increase the response time
            // Resolution is defined as 64, 128, 256, 512
            resolution: 512,
            // pixelValuesToColorFn: values => values[0] === 42 ? '#ffffff' : '#000000',
        });

        return campusHighResBasemap;
    })
    .catch(error => {
        console.error('Error loading GeoRasterLayer:', error);
        throw error; // Rethrow the error to handle it outside of this code block
    });

    // Create an object to hold the base layers
    // const baseLayers = {
    //     Carto : cartocdnLayer.addTo(map)
    //     // "Basic": maptilerLayer.addTo(map),
    // };

    var baseLayers = [
        {
            group: "Satellite Layers",
            // icon: iconByName('parking'),
            collapsed: true,
            layers: [
                {
                    name: "Carto",
                    // icon: iconByName('drinking_water'),
                    layer: cartocdnLayer
                },
            ]
        }
    ];
    
    layerControl = new L.Control.PanelLayers(baseLayers, {
        collapsibleGroups: true,
        collapsed: true
    });
    
    map.addControl(layerControl);

    // layerControl = L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

    campusHighResBasemapPromise.then(campusHighResBasemap => {
        map.fitBounds(campusHighResBasemap.getBounds());
        baseLayers["Maxar"] = campusHighResBasemap.addTo(map);
        
    });

    if (typeof L.Control.PanelLayers !== 'undefined') {
        console.log('Leaflet PanelLayers plugin is loaded successfully.');
    } else {
        pass
    }


}