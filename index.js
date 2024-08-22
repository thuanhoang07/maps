let map;
let marker;
let path;
let pathCoordinates = [];
let LAT;  
let LON; 
let GPSON = 0; // Assuming this variable is defined elsewhere

function initMap() {
    const options = {
        zoom: 14,
        center: { lat: LAT, lng: LON } 
    }

    // Initialize the map
    map = new google.maps.Map(document.getElementById('map'), options);

    // Place initial marker
    marker = new google.maps.Marker({
        position: { lat: LAT, lng: LON },
        map: map
    });

    // Initialize Polyline object to draw the path
    path = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    path.setMap(map);

    // Update map and marker coordinates every second
    setInterval(updateMapCenter, 1000);
}

function updateMapCenter() {
    if (LAT && LON) {
        const newCenter = { lat: parseFloat(LAT), lng: parseFloat(LON) };

        // Update the map's center position
        map.setCenter(newCenter);

        // Update the marker's position
        marker.setPosition(newCenter);

        // Add new position to the route if GPSON is 1
        if (GPSON === 1) {
            pathCoordinates.push(newCenter);
            path.setPath(pathCoordinates); // Update the path
        }
    }
}
