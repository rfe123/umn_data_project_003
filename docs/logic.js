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
};

function update_park_stats(city) {
    //Load the city data into section 2 visualization
    let text_element = d3.select('#section3');

    let city_data = city.data;

    text_element.text(city_data.City_Name + ' People per Acre: ' + city_data.Density_People_Per_Acre);
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
        const marker = L.marker([city.coord.lat, city.coord.lon]).addTo(myMap);
        marker.on({
            //Mouse Click
            click: function click_city_marker(event) {
                update_city_stats(city);
                update_park_stats(city);
            }
        });
        marker.bindPopup(city.name + ', ' + city.state);
    });
}

function top_cities(city_data, key, top=10) {
    let sorted_cities = city_data.sort((a,b) => b[key] - a[key]);
    return sorted_cities.slice(0, top);
};

function addCityChart(city_data) {
    //console.log(city_data);

    let walkable_cities = top_cities(city_data, 'Walkable_access_All');

    let data1 = [];
    walkable_cities.forEach(x => {
        data1.push([x.City_Name + ', ' + x.State_code, x.Population]);
    });

    //console.log(data);

    // create a chart
    chart = anychart.bar();

    // create a bar series and set the data
    var series1 = chart.bar(data1);
    series1.name("Population");

    // let data2 = [];
    // walkable_cities.forEach(x => {
    //     data2.push([x.City_Name + ', ' + x.State_code, x.Walkable_access_All]);
    // });

    // var series2 = chart.bar(data2);
    // series2.name("Walkable Park Access");

    // set the container id
    chart.container("cityChart");

    // initiate drawing the chart
    chart.draw();
};

function addParksChart(data) {

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
        console.log(x);
        return load_city_data(x);
        
    })
    .then(x => {
        addCityMarkers(x);
    });

