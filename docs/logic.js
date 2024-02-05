// Variables

// Create a map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

let cities = [];
let cityData = [];
let colors = ['#7CCD7C', '#B3EE3A', '#FFFF00', '#FFD700', '#FFA500', '#FF6347'].reverse();
let grades = [1, 10, 20, 30, 40, 50];
let drawnPolygonList = [];
let cityPolygonList = [];

//Map Init
let bounds = myMap.getBounds();
console.log(bounds);

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


//Support functions
function updateBounds() {
    bounds = myMap.getBounds();
    console.log(bounds);
}// Add a moveend event listener to the map
myMap.on('moveend', updateBounds);

// Update bar chart color by percent values
function get_value_color(value) {
    switch (true) {
        case (value < 0.50):
            return 'red';
        case (value >= 0.50 && value < 0.70):
            return 'orange';
        case (value >= 0.70):
            return 'green';
    }
};


// Selection Functions
// Update City graphic
function selected_city_chart(city) {
    //Load the city data into section 2 visualization
    //console.log(city.data);
    let text_element = d3.select('#section2');
    let city_data = city.data;

    text_element.text(city_data.City_Name + ', ' + city_data.State_code);

    let container = d3.select("#cityChart");
    container.selectAll('*').remove();

    var table = container.append("table");

    // Create table header
    //var thead = table.append("thead");
    // var headerRow = thead.append("tr");
    // headerRow.selectAll("th")
    //     .data([city.City_Name])
    //     .enter().append("th")
    //     .text(function (d) { return d; });

    // Create table body
    var tbody = table.append("tbody");
    var rows = tbody.selectAll("tr")
        .data(Object.entries(city.data))
        .enter().append("tr");

    // Create cells in each row
    var cells = rows.selectAll("td")
        .data(function (row) {
            return Object.values(row);
        })
        .enter().append("td")
        .text(function (d) { return d; });

};

// Update park chart for selection
function selected_park_chart(city) {
    //Load the city data into section 2 visualization
    let text_element = d3.select('#section3');

    let city_data = city.data;

    text_element.text(city_data.City_Name + ' Walkable Park Access');

    let parkDataDiv = d3.select("#parkChart");
    parkDataDiv.selectAll('*').remove();

    let data = [
        {
            x: "All", value: city_data.Walkable_access_All * 100,
            normal: {
                fill: get_value_color(city_data.Walkable_access_All),
                stroke: null,
                label: { enabled: true }
            }
        },
        {
            x: "Black", value: city_data.Walkable_Access_Black * 100,
            normal: {
                fill: get_value_color(city_data.Walkable_Access_Black),
                stroke: null,
                label: { enabled: true }
            }
        },
        {
            x: "Hispanic", value: city_data.Hispanic * 100,
            normal: {
                fill: get_value_color(city_data.Hispanic),
                stroke: null,
                label: { enabled: true }
            }
        },
        {
            x: "Asian", value: city_data.Asian * 100,
            normal: {
                fill: get_value_color(city_data.Asian),
                stroke: null,
                label: { enabled: true }
            }
        },
        {
            x: "Other Races", value: city_data.Other_race * 100,
            normal: {
                fill: get_value_color(city_data.Other_race),
                stroke: null,
                label: { enabled: true }
            }
        },
        {
            x: "Multiple Races", value: city_data.Multiple_races * 100,
            normal: {
                fill: get_value_color(city_data.Multiple_races),
                stroke: null,
                label: { enabled: true }
            }
        },
        {
            x: "Pacific Islander", value: city_data.Pacific_Islander * 100,
            normal: {
                fill: get_value_color(city_data.Pacific_Islander),
                stroke: null,
                label: { enabled: true }
            }
        },
        {
            x: "All People of Color", value: city_data.All_People_of_color * 100,
            normal: {
                fill: get_value_color(city_data.All_People_of_color),
                stroke: null,
                label: { enabled: true }
            }
        },
        {
            x: "White", value: city_data.White * 100,
            normal: {
                fill: get_value_color(city_data.White),
                stroke: null,
                label: { enabled: true }
            }
        }
    ];

    // create a chart
    let chart = anychart.column();

    chart.yScale().minimum(0);
    chart.yScale().maximum(100);
    chart.xAxis().labels().rotation(90);

    // create a column series and set the data
    var series = chart.column(data.sort((a, b) => a.x.localeCompare(b.x)));
    series.name("Walkable Park Access");


    // set the container id
    chart.container("parkChart");
    // initiate drawing the chart
    chart.draw();
};

// Add city polygon
function drawCityBoundary(currentCityName, currentStateName) {
    console.log('currentCity ' + currentCityName);
    console.log('currentState ' + currentStateName);

    for (i = 0; i <= cityPolygonList.features.length - 1; i++) {

        //console.log('city name is ' + cityPolygonList.features[i].properties.NAME + i);

        if (cityPolygonList.features[i].properties.NAME === currentCityName &&
            cityPolygonList.features[i].properties.ST === currentStateName) {

            console.log('type is ' + cityPolygonList.features[i].geometry.type + i)

            let coordinatesList = cityPolygonList.features[i].geometry.coordinates;
            console.log(coordinatesList);
            console.log(cityPolygonList.features[i])

            let geojsonFeature = {
                type: 'Feature',
                geometry: {
                    type: cityPolygonList.features[i].geometry.type,
                    coordinates: coordinatesList
                },
                properties: {
                    "color": "blue",
                    "fill-opacity": 0.5
                }
            };

            // create the geoJSON layer and assign an ID to remove it later
            L.geoJSON(geojsonFeature, { id: 'geolayer' }).addTo(myMap);  //this replaces line 215 (in my code) in the script under the drawCityBoundary function
            console.log('added map for :' + currentCityName);
            //drawnPolygonList.push(geojsonFeature);
        }
    }
}

//Marker Functions
// Add Map Legend
function addLegend() {
    let legend = L.control({ position: 'bottomright' })
    legend.onAdd = function () {
        let container = L.DomUtil.create('div', 'info legend');
        let p = L.DomUtil.create('p', 'legend-title');
        p.textContent = 'Park area per thousand people, acres';
        container.appendChild(p);
        let div = L.DomUtil.create('div', 'info legend');
        container.style.backgroundColor = 'white';
        div.style.width = '120px';
        div.style.height = '150px';
        for (let i = 0; i < colors.length; i++) {
            div.innerHTML +=
                '<div><span style="background:' + colors[i] + '; width: 20px; height: 20px; display: inline-block;"></span> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        container.appendChild(div);
        return container;
    };
    legend.addTo(myMap);
}

// Add markers
function addCityMarkers(localCityData) {
    // Handle the loaded data
    //console.log(localCityData);
    addLegend();

    cities.forEach((element) => {
        // Assuming City_Name is the property in each element
        for (let i = 0; i < localCityData.length; i++) {
            if (element.City_Name === localCityData[i].name & element.State_code === localCityData[i].state) {
                //console.log(localCityData[i].name);
                // Add the matching city data to the cityData array
                cityData.push({ name: localCityData[i].name, state: element.State_code, coord: localCityData[i].coord, data: element });
            }
        }
    });

    function scaleValue(value, originalMin, originalMax, targetMin, targetMax) {
        return (value - originalMin) / (originalMax - originalMin) * (targetMax - targetMin) + targetMin;
    }

    function getMarkerRadius(population) {
        const originalMin = 200000;
        const originalMax = 8850000;
        const targetMin = 5;
        const targetMax = 50;

        return scaleValue(population, originalMin, originalMax, targetMin, targetMax);
    }

    function getMarkerColor(acres) {
        let normalizedAcres = (acres - grades[0]) / (grades[grades.length - 1] - grades[0]);
        normalizedAcres = Math.max(0, Math.min(normalizedAcres, 1));
        let colorIndex = Math.floor(normalizedAcres * (colors.length - 1));
        colorIndex = Math.max(0, Math.min(colorIndex, colors.length - 1));
        let calculatedColor = colors[colorIndex];
        return calculatedColor;
    }

    cityData.forEach(city => {
        //define the tree icon
        const treeIcon = L.icon({
            iconUrl: 'treeIcon.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });
        // let marker = L.marker([city.coord.lat, city.coord.lon], { icon: treeIcon }).addTo(myMap);
        const marker = L.circleMarker([city.coord.lat, city.coord.lon], {
            radius: getMarkerRadius(city.data.Population),
            fillColor: getMarkerColor(city.data.Acres_per_thousand_people),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(myMap);
        marker.on({
            //Mouse Click
            click: function click_city_marker(event) {
                // remove the GeoJSON polygon from the map
                myMap.eachLayer(function (layer) {
                    if (layer.options && layer.options.id === 'geolayer') {
                        myMap.removeLayer(layer);
                    }
                });

                //if (geojsonFeature) {
                //    myMap.removeLayer(geojsonFeature);
                //}
                selected_city_chart(city);
                selected_park_chart(city);
                //zoom to city level upon click
                // const zoomTreeIcon = L.icon({
                //     iconUrl: 'treeIcon.png',
                //     iconSize: [64, 64], 
                //     iconAnchor: [32, 32], 
                //     popupAnchor: [0, -32] 
                // });
                // let markerZoom = L.marker([city.coord.lat, city.coord.lon], { icon: zoomTreeIcon }).addTo(myMap);
                myMap.setView(marker.getLatLng(), 12);

                drawCityBoundary(city.name, city.state);
            }
        });
        //marker.bindPopup(city.name + ', ' + city.state);
        marker.bindTooltip(city.name + ', ' + city.state, { permanent: false, opacity: 1, autoClose: false });
    });
}


// Filter top X cities for a given key (Assumes numeric properties)
function top_cities(city_data, key, top = 10) {
    let sorted_cities = city_data.sort((a, b) => b[key] - a[key]);
    return sorted_cities.slice(0, top);
};

// Get overall park data 
function overall_parks_chart(city_data) {
    //console.log(city_data);
    let text_element = d3.select('#section3');

    text_element.text('Overall Walkability');

    let walkable_cities = top_cities(city_data, 'Walkable_access_All', 100);
    console.log(walkable_cities);

    let data1 = [];
    walkable_cities.forEach(x => {
        // data1.push([x.City_Name + ', ' + x.State_code, ()]);
        data1.push(
            {
                x: x.City_Name + ', ' + x.State_code,
                value: x.Walkable_access_All * 100,
                normal: {
                    fill: get_value_color(x.Walkable_access_All),
                    stroke: null
                }
            },
        )
    });

    // create a chart
    chart = anychart.bar();

    // create a bar series and set the data
    var series1 = chart.bar(data1);
    series1.name("Walkability");

    // let data2 = [];
    // walkable_cities.forEach(x => {
    //     data2.push([x.City_Name + ', ' + x.State_code, (x.Walkability_Low_Income * 100)]);
    // });

    // var series2 = chart.bar(data2);
    // series2.name("Low Income Walkability");

    // set the container id
    chart.container("parkChart");

    // initiate drawing the chart
    chart.draw();
};

//Get overall city data
function overall_cities_chart(city_data) {
    let text_element = d3.select('#section2');
    text_element.text('Overall City Populations');
    let topPopulation = top_cities(city_data, 'Population', 100);
    let container = d3.select("#cityChart");
    container.selectAll('*').remove();

    // Create the table
    var table = container.append("table");

    // Create table header
    var thead = table.append("thead");
    var headerRow = thead.append("tr");
    headerRow.selectAll("th")
        .data(['City Name', 'Population'])
        .enter().append("th")
        .text(function (d) { return d; });

    // Create table body
    var tbody = table.append("tbody");
    var rows = tbody.selectAll("tr")
        .data(topPopulation)
        .enter().append("tr");

    // Create cells in each row
    var cells = rows.selectAll("td")
        .data(function (row) {
            return Object.values([row.City_Name, row.Population]);
        })
        .enter().append("td")
        .text(function (d) { return d; });

    // <table>
    // <table>

};

// Load city data
function load_city_data(data) {
    data.forEach((element) => {
        // Assuming City_Name and State_code are properties in each element
        const city = element.City_Name;
        const state = element.State_code;

        // Add city and state to the cities array
        cities.push(element);
    });

    //console.log(cities);

    // Return the promise to continue the chain
    return d3.json('city.list.json');
}

// load Polygons
function loadCityPolygons() {
    d3.json('output.geojson')
        .then(function (data) {
            cityPolygonList = data;
            console.log('GeoJSON Data:', cityPolygonList);
        })
}

// function loadParkPolygons() {
//     d3.json('parkPolygons.geojson')
//       .then(function(data) {
//         let parkPolygons = data;
//         // Log the GeoJSON data to the console
//             console.log('GeoJSON Data:', parkPolygons);
//       })
// }

// Add a reset button event listener
document.getElementById('resetButton').addEventListener('click', function () {
    // Reset the map view to the initial position and zoom
    myMap.setView([37.09, -95.71], 5);

    // remove the GeoJSON polygon from the map
    myMap.eachLayer(function (layer) {
        if (layer.options && layer.options.id === 'geolayer') {
            myMap.removeLayer(layer);
        }
    });

    let cityChart = d3.select("#cityChart");
    cityChart.selectAll('*').remove();

    let parkChart = d3.select("#parkChart");
    parkChart.selectAll('*').remove();

    console.log(cities);
    overall_cities_chart(cities);
    overall_parks_chart(cities);
});

// Load data from the Flask API
d3.json('http://127.0.0.1:8080/api/all_data/')
    .then(x => {
        load_city_data(x.cities);
        // Return the promise to continue the chain
        return d3.json('city.list.json');
        //loadParkPolygons();
    })
    .then(x => {
        addCityMarkers(x);
    }).then(x => {
        overall_cities_chart(cities);
        overall_parks_chart(cities);
        loadCityPolygons();
    });

