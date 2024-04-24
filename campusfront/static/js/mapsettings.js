// Add a function to initialize the map
// During initilization use the ParseGeoraster method to add a local high resolution imagey into the map
// Equally Add as an overlay, allowing the image to be toggled on and off
// Constants
const API_KEY  = '3A9BRVqaxuV6mvPuJQPM';
const mediaURL = '/media/'
const GEOTIFF_FILE_PATH  = "static/basemap/UON_KE_Nairobi_19Q2_V0_R4C5_cog.tif";
// const GEOTIFF_FILE_PATH = 'https://raw.githubusercontent.com/passies95/campus/main/campusfront/static/basemap/UON_KE_Nairobi_19Q2_V0_R4C5_cog.tif';


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

// Define the promise outside the function
const campusHighResBasemapPromise = fetch(GEOTIFF_FILE_PATH)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => parseGeoraster(arrayBuffer))
    .then(georaster => {
        // console.log("georaster:", georaster);

        const campusHighResBasemap = new GeoRasterLayer({
            attribution: "Maxar Technologies",
            georaster: georaster,
            opacity: 10,
            resolution: 512,
        });

        return campusHighResBasemap;
    })
    .catch(error => {
        console.error('Error loading GeoRasterLayer:', error);
        throw error;
    });

// Function for map initialization
function map_initialization (map, options) {

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

    
    // Create an object to hold the base layers
    const baseLayers = [
        {
            name: "Carto",
            layer: cartocdnLayer.addTo(map)
        }
    ];
    
    // Initialize overlays
    const overlays = [];
    
    // Initialize the panel layers control
    const panelLayers = new L.Control.PanelLayers(baseLayers, overlays, {
        collapsibleGroups: true,
        collapsed: false,
        compact: true,
        position: 'topright'
    });
    
    map.addControl(panelLayers);
    
    // Add the Maxar Image to the base layers
    campusHighResBasemapPromise.then(campusHighResBasemap => {
        // Add basemap to the baseLayers group
        panelLayers.addBaseLayer({ name: 'Maxar', layer: campusHighResBasemap });
        // panelLayers.addBaseLayer({ name: 'Maxar', layer: campusHighResBasemap }, 'Base Layers');
    });
    
    // Adjust the position of the panel control below the search bar
    const searchbarElement = document.querySelector('.searchbar');
    const searchbarHeight = searchbarElement ? searchbarElement.clientHeight : 0;
    const panelContainer = panelLayers.getContainer();
    if (panelContainer) {
        panelContainer.style.position = 'absolute';
        panelContainer.style.top = `${searchbarHeight + 20}px`; // Move it 10px below the bottom of the searchbar
        panelContainer.style.right = '5px'; // Adjust the value as needed
    }

    // Change the controls to the bottom right to prevent from being hidden by the search bar
    map.zoomControl.setPosition('bottomright');

    // Add the Datasets to the Map
    // Create a LayerGroup to hold the data layers
    const dataLayerGroup = L.layerGroup();

    // Retrieve the buildings, schools data that was added to html using the json script method
    const building_data = document.getElementById("buildings-data");
    const schools_data = document.getElementById("schools-data");
    const departments_data = document.getElementById("departments-data");
    
    // console.log(departments_data)
    // console.log(schools_data)

    // Check if the building data is present
    if (building_data) {
        // Parse the GeoJSON data
        const parsedBuildingData = JSON.parse(building_data.textContent);

        // Log the parsed data to the console to verify
        // console.log(parsedBuildingData);

        // Add GeoJSON layers to the map
        var building_feature = L.geoJSON(parsedBuildingData, {
            style: function(feature){
                var type = feature.properties.usage;
                if (type === 'Multipurpose'){
                    return {color: 'blue',
                            fillColor: 'blue',
                            fillOpacity: 0.2,}
                } else {
                    return {color: 'orange',
                    fillColor: 'orange',
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
                // layer.on('mouseover', function(e){
                //     this.openPopup()
                // })

                // Add a custom property to the layer to usef or later referencing
                layer.layerName = 'Building';
            },
        }).addTo(map);
        dataLayerGroup.addLayer(building_feature);
        // console.log(building_feature)
    } else {
        console.error("Building data not found.");
    }

    // Fit the data to the map using the bounds of the data
    const buildingBounds = building_feature.getBounds();

    // Fit the map view to the bounds of the building data
    map.fitBounds(buildingBounds);

    // Add the Data to the Panel Layers
    panelLayers.addOverlay({ name: 'Buildings', layer: building_feature });

    // Add the Schools Data
    // Check if the building data is present
    // Function to fetch departments data

    if (schools_data && departments_data ) {
        // Parse the GeoJSON data
        const parsedSchoolsData = JSON.parse(schools_data.textContent);
        const parsedDepartmentsData = JSON.parse(departments_data.textContent);

        // Log the parsed data to the console to verify
        // console.log(parsedSchoolsData);
        // console.log(parsedDepartmentsData);

        parsedDepartmentsData.features.forEach(departmentFeature => {
            // Access the schoolID property within department properties
            const schoolID = departmentFeature.properties.schoolID;
            console.log()
    
            // Find the corresponding school feature in parsedSchoolsData
            const schoolFeature = parsedSchoolsData.features.find(school => school.properties.schoolID === schoolID);
    
            // If school feature is found, log its geometry to console
            if (schoolFeature) {
                console.log("School Geometry:", schoolFeature.geometry);
            } else {
                console.error("School not found for department:", departmentFeature.properties.name);
            }
        });

        // Add GeoJSON layers to the map
        var schools_feature = L.geoJSON(parsedSchoolsData, {
            style: {
                // fill : false,
                color: 'yellow',
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
                layer.layerName = 'Faculty';
            },
        }).addTo(map).bringToBack();
        dataLayerGroup.addLayer(schools_feature);

        // Parse the Departments Data
        var department_data = L.geoJSON(parsedDepartmentsData) 

    } else {
        console.error("Schools or Departments data not found.");
    }

    // Add the Layer to the panel layer
    panelLayers.addOverlay({ name: 'Schools', layer: schools_feature });

    // // Add the Departments data
    // if (departments_data) {
    //     // Parse the GeoJSON data
    //     const parsedDepartmentsData = JSON.parse(departments_data.textContent);

    //     // Log the parsed data to the console to verify
    //     // console.log(parsedDepartmentsData);
     
    // } else {
    //     console.error("Departments data not found.");
    // }

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
            zoom:19,
            textErr:'No match found. Try a different search e.g AW402',
            textPlaceholder:'Search here..e.g Building, School name',
            buildTip: function(text, val) {
                var type = val.layer.layerName;
                // console.log(val)
                return '<a href="#" class="'+type+'">'+text+'<b>'+type+'</b></a>';
            }
        });
        map.addControl(searchControl);
        // Listen to the 'search:locationfound' event
        // Variable to store the highlighted layer
        var highlightedLayer;
        // variable to store feature coordinates of the searched feature
        var feature_coords;
        // Declare routingControl variable outside of the event listener
        var routingControl;

        // Flag to retain previous search if button is clicked
        let isFirstSearch = true;
        let previousSearchQuery;
        var buttonClicked = false;

        // Listen to the 'search:locationfound' event
        searchControl.on('search:locationfound', function(event) {
            // Handle the layer associated with the found location
            if (isFirstSearch) {
                // Handle the first search location found event
                var layer = handleFoundLocation(event.layer);
                console.log(layer)
        
                // Create and display popup
                createAndDisplayPopup(event.latlng);
                console.log('Is first Search')
            } else {
                // Handle the second search location found event
                var layer = handleSecondLocationFound(event.layer);
                console.log(previousSearchQuery)
                console.log(feature_coords)
                addRouteToSearchedPoint(previousSearchQuery.reverse(), feature_coords.reverse())
            }
            
        });

        // Function to handle the layer associated with the found location
        function handleFoundLocation(layer) {
            // Change the previous coordinates to null if no button was clicked
            if (!buttonClicked) {
                feature_coords = null;
                previousSearchQuery = null
            }
            // Deselect the previous highlight, if any
            if (highlightedLayer) {
                highlightedLayer.setStyle({ fillOpacity: 0.2 });
            }

            if (layer) {
                // Highlight the layer by setting fill opacity to 1
                layer.setStyle({ fillOpacity: 1 });

                if (layer.layerName === 'Building') {
                    // Handle building layer
                    handleBuildingLayer(layer);
                } else {
                    // Handle other layers
                    console.log('Layer other than Building found.');
                }

                // Store the highlighted layer for future reference
                highlightedLayer = layer;
            }

            return layer;
        }

        // Function to handle second location
        function handleSecondLocationFound(layer) {
            if (layer) {
                // Highlight the layer by setting fill opacity to 1
                layer.setStyle({ fillOpacity: 1 });

                if (layer.layerName === 'Building') {
                    // Handle building layer
                    feature_coords= handleBuildingLayer(layer);
                } else {
                    // Handle other layers
                    console.log('Layer other than Building found.');
                }

                // Store the highlighted layer for future reference
                highlightedLayer = layer;
                console.log(feature_coords)
                // return back the flag to true
                isFirstSearch = true
            }

            return layer;
        }

        // Function to handle the building layer
        function handleBuildingLayer(layer) {
            if (layer.feature.properties.entrace) {
                const coordinateString = layer.feature.properties.entrace;
                // Extracting the coordinates using string manipulation
                const startIndex = coordinateString.indexOf('(') + 1;
                const endIndex = coordinateString.indexOf(')');
                const coordinatesString = coordinateString.substring(startIndex, endIndex);
                // Splitting the coordinates string by space and parsing latitude and longitude
                const coordinates = coordinatesString.split(' ').map(parseFloat);
                feature_coords = coordinates; // Assign value to feature_coords
            } else {
                const feature_lat = layer._map._lastCenter.lat;
                const feature_long = layer._map._lastCenter.lng;
                feature_coords = [feature_long, feature_lat]; // Place in the long lat notation
            }
            return feature_coords;
        }

        // function createButton(label, container) {
        function createButton(label, container) {
            var btn = L.DomUtil.create('button', 'navigation-popup-button', container);
            btn.setAttribute('type', 'button');
            btn.innerHTML = label;
            return btn;
        }

        // Function to create and display popup with navigation options
        function createAndDisplayPopup(latlng) {
            // Create a popup with a question and buttons to choose navigation options
            var navigation_container = L.DomUtil.create('div', 'navigation_container');
            question = L.DomUtil.create('div', '', navigation_container),
            startBtn = createButton('Start from this location', navigation_container);
            destBtn = createButton('Go to this location', navigation_container);

            // Create a popup with a question and buttons to choose navigation options
            question.textContent = 'Would you like to navigate?';
            var navigation_popup = L.popup()
                .setContent(navigation_container)
                .setLatLng(latlng)
                .openOn(map);

            // Event listener for the "Start from this location" button
            startBtn.addEventListener('click', function() {
                // Close the popup after clicking the button
                navigation_popup.remove();
                // Set the buttonClicked flag to true
                buttonClicked = true;
                previousSearchQuery = feature_coords
                console.log(previousSearchQuery)
                captureSecondpoint();
            });

            // Event listener for the "Go to this location" button
            destBtn.addEventListener('click', function() {
                previousSearchQuery = latlng
                // Capture the second set of points and add route
                captureSecondpoint();
                // Close the popup after clicking the button
                navigation_popup.remove();
                // Set the buttonClicked flag to true
                buttonClicked = true;
            });
        }

        function captureSecondpoint() {
            var searchInput = document.querySelector('.leaflet-control-search input.search-input');
            if (searchInput) {
                // Clear the search input
                searchInput.value = '';
                // Focus on the search input field to allow the user to enter the destination
                searchInput.focus();
                searchInput.placeholder = 'Enter the Second Location';
            }
            isFirstSearch = false;
        }

        // Function to add a route
        function addRouteToSearchedPoint(StartPoint, EndPoint) {
            waypoints = [StartPoint, EndPoint]
            if (waypoints) {
                // Remove existing routing control
                if (routingControl) {
                    map.removeControl(routingControl);
                }

                // Add a new routing control
                routingControl = L.Routing.control({
                    waypoints: waypoints
                }).addTo(map);
            }else {
                console.error('Previous search query is not available.');
            }
        }

        // Function to modify the routing machine continer
        function checkElementLoaded() {
            var element = document.querySelector('.leaflet-routing-container');
            if (element) {
                // console.log('div loaded successfully');

                var closeButton = document.createElement('button');
                closeButton.innerHTML = '<i class="fas fa-times"></i>';
                closeButton.classList.add('close-button');

                // Add click event listener to close the container
                closeButton.addEventListener('click', function() {
                    element.style.display = 'none'; // Hide the container when close button is clicked
                });

                // Append close button to the container
                element.appendChild(closeButton);
            }
        }

        // Listen to click events on the map to deselect the highlighted layer
        map.on('click', function() {
            // Deselect the highlighted layer, if any
            if (highlightedLayer) {
                highlightedLayer.setStyle({ fillOpacity: 0.2 });
                highlightedLayer = null; // Clear the highlighted layer reference
            }
        });
        // Attach click event listener to each feature layer
        dataLayerGroup.eachLayer(function(layer) {
            layer.on('click', function() {
                // Check if a layer is currently highlighted
                if (highlightedLayer) {
                    // Deselect the previously highlighted layer
                    highlightedLayer.setStyle({ fillOpacity: 0.2 });
                }
            });
        });
        
    } else {
        console.error('Leaflet Search plugin is not loaded.');
    }


    // Adding a routing control
    // map click event
    map.on('click', function(e) {
        console.log(e)
    })

    // Modify the Leaflet Route Control
    // document.addEventListener("DOMContentLoaded", function() {
    //     // Wait for the DOM to be fully loaded

    //     // Function to add a close button to the Leaflet Routing Machine container
    //     function addCloseButton() {
    //         // Target the Leaflet Routing Machine container
    //         var routingContainer = document.querySelector('.leaflet-routing-container');

    //         // Check if the container exists
    //         if (routingContainer) {
    //             // Create a close button element
    //             var closeButton = document.createElement("button");
    //             closeButton.classList.add("close-button");
    //             closeButton.textContent = "Close";

    //             // Append the close button to the container
    //             routingContainer.appendChild(closeButton);
    //         }
    //     }

    //     // Call the function to add the close button
    //     addCloseButton();
    // });
    
    

    




}