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
    switch(true) {
        case (value <0.50):
            return 'red';
        case (value >= 0.50 && value < 0.70):
            return 'orange';
        case (value >= 0.70):
            return 'green';
    }
}

function update_park_stats(city) {
    //Load the city data into section 2 visualization
    let text_element = d3.select('#section3');

    let city_data = city.data;

    text_element.text(city_data.City_Name + ' Walkable Park Access');

    let parkDataDiv = d3.select("#parkChart");
    parkDataDiv.selectAll('*').remove();

    let data = [
        ["All", city_data.Walkable_access_All * 100],
        ["Black", city_data.Walkable_Access_Black * 100],
        ["Hispanic", city_data.Hispanic * 100],
        ["Asian", city_data.Asian * 100],
        ["Other Races", city_data.Other_race * 100]
    ];

    let colors = [
        get_value_color(city_data.Walkable_access_All),
        get_value_color(city_data.Walkable_Access_Black),
        get_value_color(city_data.Hispanic),
        get_value_color(city_data.Asian),
        get_value_color(city_data.Other_race)
    ];

    // create a chart
    let chart = anychart.column();

    chart.palette(colors);

    chart.yScale().minimum(0);
    chart.yScale().maximum(100);

    // create a column series and set the data
    var series = chart.column(data);
    series.name("Walkable Park Access");

    // set the container id
    chart.container("parkChart");
    // initiate drawing the chart
    chart.draw();
};

function addCityMarkers(localCityData) {
    // Handle the loaded data
    //console.log(localCityData);

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

    cityData.forEach(city => {
        //define the tree icon
        const customIcon = L.icon({
            iconUrl: 'tree1.png',
            iconSize: [32, 32], // Set the size of your icon
            iconAnchor: [16, 16], // Set the anchor point
            popupAnchor: [0, -16] // Set the popup anchor point
          });
        
          // Add a marker with the tree icon
        const marker = L.marker([city.coord.lat, city.coord.lon], { icon: customIcon }).addTo(myMap);
        //const marker = L.marker([city.coord.lat, city.coord.lon]).addTo(myMap);
        marker.on({
            //Mouse Click
            click: function click_city_marker(event) {
                update_city_stats(city);
                update_park_stats(city);
                myMap.setView(marker.getLatLng(), 11); 
            }
         });
        marker.bindPopup(city.name + ', ' + city.state);
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
    let topPopulation = top_cities(city_data, 'Population', 25);
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
}



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
