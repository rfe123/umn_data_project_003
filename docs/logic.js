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

// Load data from the Flask API
d3.json('http://127.0.0.1:5000/api/all_data')
    .then(function (data) {
        const all_data = data[0];

        all_data.forEach((element) => {
            // Assuming City_Name and State_code are properties in each element
            const city = element.City_Name;
            const state = element.State_code;

            // Add city and state to the cities array
            cities.push({ city: city, state: state });
        });

        console.log(cities);

        // Return the promise to continue the chain
        return d3.json('city.list.json');
    })
    .then(function (localCityData) {
        // Handle the loaded data
        //console.log(localCityData);

        cities.forEach((element) => {
            // Assuming City_Name is the property in each element
            for (let i = 0; i < localCityData.length; i++) {
                if (element.city === localCityData[i].name & element.state === localCityData[i].state) {
                    //console.log(localCityData[i].name);
                    // Add the matching city data to the cityData array
                    cityData.push({name:localCityData[i].name, coord:localCityData[i].coord});
                }
            }
        });

        console.log(cityData);

        cityData.forEach(city => {
            const marker = L.marker([city.coord.lat, city.coord.lon]).addTo(myMap);
            marker.bindPopup(city.name);
        });
    });
