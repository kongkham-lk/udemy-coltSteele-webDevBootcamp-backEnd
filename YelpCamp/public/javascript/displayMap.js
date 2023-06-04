// instead of direct insert mapbox-token => insert token in .env file instead => when want to edit, no need to go to edit many places
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

// Create a default Marker (location pointer) and add it to the map.
const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);

    