let map;
let marker;
let path;
let pathCoordinates = [];
let LAT;  
let LON; 
let SPEED;
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

    // Update map and marker coordinates every second
    setInterval(updateMapCenter, 1000);
}

function getStrokeColorBasedOnSpeed(speed) {
    if (speed <= 20) {
        return '#0000FF'; // Blue
    } else if (speed <= 40) {
        return '#008000'; // Green
    } else if (speed <= 60) {
        return '#FF0000'; // Red
    } else if (speed <= 80) {
        return '#800080'; // Purple
    } else {
        return '#000000'; // Black
    }
}

function initializePath() {
    const strokeColor = getStrokeColorBasedOnSpeed(SPEED); // Determine color based on speed
    path = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: strokeColor,
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    path.setMap(map);
}

function updateMapCenter() {
    if (LAT && LON) {
        const newCenter = { lat: parseFloat(LAT), lng: parseFloat(LON) };

        // Update the map's center position
        map.setCenter(newCenter);

        // Update the marker's position
        marker.setPosition(newCenter);

        // Add new position to the route
        if (GPSON === 1) {
            if (!path) {
                initializePath(); // Initialize a new path if GPSON was set to 1
            }
            pathCoordinates.push(newCenter);
            path.setPath(pathCoordinates); // Update the path
        } else if (GPSON === 0) {
            path = null; // Stop adding to the current path without clearing the existing path
        }
    }
}
