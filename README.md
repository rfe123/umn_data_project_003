# umn_data_project_003
Team Project for creating a Visualization Dashboard using ETL and Visualization concepts from previous modules

Team - Bob Erickson Cindy Hansel Matt Idle Michelle Clark Nadzeya Slabukha

After identifying reliable datasets, we underwent a data refinement process employing Pandas and the "Data Wrangler" extension within VSCode. Once the data was cleansed and organized, we crafted a Python script. This script was designed to either establish a new SQLite database or connect to an existing one. It then proceeded to ingest data from a CSV file and integrate it into the SQLite database, creating a table where the "id" column was designated as the primary key.
Originally, our project had plans for an additional "Bonus" element. Unfortunately, due to time constraints, this aspect remained unfinished. Hence, you may notice the existence of a second table labeled "UFO" within the database.
Subsequently, we developed a Python application utilizing the SQLAlchemy library to facilitate interaction with the SQLite database. To serve various endpoints, we harnessed the Flask micro-framework, which streamlined the handling of HTTP requests and responses.

Within the HTML file, we refer to a main "logic.js" file, which uses D3 to load data through Flask from SQLite for visualizations. Users should use the Map visual as the main focus of the application, selecting a city marker to view more detailed information about the park data provided for that city. A "Reset" button is available in the upper left corner to bring the overall display back up after chart selection.

We took care to utilize publicly available data sets and visualization tools. Our data does not include any identifiable information, instead showing aggregated percentages based on US Census data for demographic details of each city.

## Goal

3 Visualizations of Information 
- Leaflet Map
- AnyChart Bar Chart & Column Chart
- HTML Table
- Update Charts & Table based on selections made in the Map
  
## New Libraries or Tools
from pyproj import Proj, transform - used in conversion of geojson epsg:3857 to epsg:4326
AnyChart.js Visualizations
VS Code DataWrangler

## Additional Future Expansions
-	Create more base and overlay layers and exercise layer controls
-	Automate some of the etl process to lower data size and optimize performance
-	Put markers into the city areas to show info of particular parks (custom tree icons)
-	Dynamic Zoom to filter overall city & park displays
-	Continue to improve the charts - focus the map based on chart city selections
-	Include UFO sightings in the general area of the parks.

## References

- ParkServe Park/City Data 
- OpenWeather City Coordinates (JSON Download)
- U of Minnesota class materials and solutions
- chatgpt - to find resources and code to use for conversions of coordinates
- import geopandas as gpd - used in conversion of .shp to .geojson boundary coordinates
- City Boundaries - https://data.cdc.gov/500-Cities-Places/500-Cities-City-Boundaries/n44h-hy2j/about_data
- https://onlinepngtools.com/create-transparent-png

