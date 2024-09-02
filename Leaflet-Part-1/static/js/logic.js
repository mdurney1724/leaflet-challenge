let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(magnitude) {
    return magnitude * 3;
}

function markerColor(depth) {
    if (depth > 90) return "#FF0000";
    else if (depth > 70) return "#FF4500";
    else if (depth > 50) return "#FFA500";
    else if (depth > 30) return "#FFD700";
    else if (depth > 10) return "#FFFF00";
    else return "#90EE90";
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
    }).addTo(myMap);

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];

        div.innerHTML += '<h4>Depth</h4>';

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
});