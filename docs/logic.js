// Create a map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let cities = [];
let cityData = [];
let colors = ['#7CCD7C', '#B3EE3A', '#FFFF00', '#FFD700', '#FFA500', '#FF6347'];
let grades = [1, 10, 20, 30, 40, 50];

function update_city_stats(city) {
    //Load the city data into section 2 visualization
    //console.log(city.data);
    let text_element = d3.select('#section2');
    let city_data = city.data;

    text_element.text(city_data.City_Name + ', ' + city_data.State_code);

    let cityDataDiv = d3.select("#cityChart");
    cityDataDiv.selectAll('*').remove();

    cityDataDiv.selectAll('p')
        .data(Object.entries(city_data))
        .enter()
        .append('p')
        .text(d => `${d[0]}: ${d[1]}`);

};

function get_value_color(value) {
    switch (true) {
        case (value < 0.50):
            return 'red';
        case (value >= 0.50 && value < 0.70):
            return 'orange';
        case (value >= 0.70):
            return 'green';
    }
}

function park_plot_data(city) {

}

function update_park_stats(city) {
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
    var series = chart.column(data.sort((a,b) => a.x.localeCompare(b.x)));
    series.name("Walkable Park Access");


    // set the container id
    chart.container("parkChart");
    // initiate drawing the chart
    chart.draw();
};

function addLegend(){
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

function addCityMarkers(localCityData) {
    // Handle the loaded data
    //console.log(localCityData);
    addLegend();

    cities.forEach((element) => {
        // Assuming City_Name is the property in each element
        for (let i = 0; i < localCityData.length; i++) {
            if (element.city === localCityData[i].name & element.state === localCityData[i].state) {
                //console.log(localCityData[i].name);
                // Add the matching city data to the cityData array
                cityData.push({ name: localCityData[i].name, state: element.state, coord: localCityData[i].coord, data: element.data });
            }
        }
    });

    //console.log(cityData);

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
        const marker = L.circleMarker([city.coord.lat, city.coord.lon], {radius: getMarkerRadius(city.data.Population),
            fillColor: getMarkerColor(city.data.Acres_per_thousand_people),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8}).addTo(myMap);
        marker.on({
            //Mouse Click
            click: function click_city_marker(event) {
                update_city_stats(city);
                update_park_stats(city);
            }
        });
        //marker.bindPopup(city.name + ', ' + city.state);
        marker.bindTooltip(city.name + ', ' + city.state, { permanent: false, opacity: 1, autoClose: false });
    });
}

function top_cities(city_data, key, top = 10) {
    let sorted_cities = city_data.sort((a, b) => b[key] - a[key]);
    return sorted_cities.slice(0, top);
};

function addParkChart(city_data) {
    //console.log(city_data);

    let walkable_cities = top_cities(city_data, 'Walkable_access_All');
    console.log(walkable_cities);

    let data1 = [];
    walkable_cities.forEach(x => {
        data1.push([x.City_Name + ', ' + x.State_code, (x.Walkable_access_All * 100)]);
    });

    // create a chart
    chart = anychart.bar();

    // create a bar series and set the data
    var series1 = chart.bar(data1);
    series1.name("Walkability");

    let data2 = [];
    walkable_cities.forEach(x => {
        data2.push([x.City_Name + ', ' + x.State_code, (x.Walkability_Low_Income * 100)]);
    });

    var series2 = chart.bar(data2);
    series2.name("Low Income Walkability");

    // set the container id
    chart.container("parkChart");

    // initiate drawing the chart
    chart.draw();
};

function addCityChart(city_data) {
    let topPopulation = top_cities(city_data, 'Population', 100);
    let parkDataDiv = d3.select("#cityChart");
    parkDataDiv.selectAll('*').remove();

    console.log(topPopulation);

    parkDataDiv.selectAll('p')
        .data(topPopulation)
        .enter()
        .append('p')
        .text(d => `${d.City_Name}: ${d.Population}`);

};

function load_city_data(data) {
    data.forEach((element) => {
        // Assuming City_Name and State_code are properties in each element
        const city = element.City_Name;
        const state = element.State_code;

        // Add city and state to the cities array
        cities.push({ city: city, state: state, data: element });
    });

    //console.log(cities);

    // Return the promise to continue the chain
    return d3.json('city.list.json');
};

// Load data from the Flask API
d3.json('http://127.0.0.1:8080/api/all_data')
    .then(x => {
        addCityChart(x);
        addParkChart(x);
        return load_city_data(x);
    })
    .then(x => {
        addCityMarkers(x);
    });
