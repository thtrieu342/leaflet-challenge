//create base layer for map
var basemap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 500,
      maxZoom: 15,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    }
  );

  var map = L.map("mapid", {
    center: [
      36.09, -95.75
    ],
    zoom: 5
  });

  basemap.addTo(map);
  
// use d3 to get data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function(data){
    console.log(data)

    //look at data in console, find which data to plot (magnitude & coordinates) and stylize
    function mapStyle(feature) {
        return{
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.properties.mag),
            color: "#000000",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    //function to determine the color based on the magnitude
    function mapColor(mag){
        switch (true){
            case mag > 5:
                return "#a63603";
            case mag > 4:
                return "#e6550d";
            case mag > 3:
                return "#fd8d3c";
            case mag > 2:
                return "#fdbe85";
            case mag > 1:
                return "#feedde";
             default:
                return "#98ee00";
        }
    }

    function mapRadius(mag) {
        if (mag === 0) {
          return 1;
        }
    
        return mag * 4;
    }    

    //add geojson layer
    L.geoJson(data,{
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // style for marker on map
      style: mapStyle,

      // popup for each marker to display the magnitude and location of the earthquake 
      onEachFeature: function(feature, layer) {
        layer.bindPopup(
          "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
        );
      }
    }).addTo(map)
        
    //legend
    var legend = L.control({
        position: "bottomright"
    });    

    //adding details to legend
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = ["#98ee00","#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"];
    
    //loop through the intervals of colors to put into the label
    for (var i = 0; i<grades.length; i++) {
        div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
    legend.addTo(map);

});