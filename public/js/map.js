



console.log(mapToken, "in map.js");
mapboxgl.accessToken = mapToken;
//ading map
const map = new mapboxgl.Map(
    {
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom

    }
);


// Create a default Marker and add it to the map.

const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(coordinates)//listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25, })
    .setHTML(`<h4>${listing.title}</h4><p>exact location will be provided</p>`))
    .addTo(map);
