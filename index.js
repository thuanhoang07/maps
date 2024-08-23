let map;
let marker;
let currentPath;
let LAT;  
let LON;
let speed; // Assume this variable is defined and updated elsewhere
let GPSON = 0; // Assuming this variable is defined elsewhere

function initMap() {
    const options = {
        zoom: 14,
        center: { lat: LAT, lng: LON }
    };

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

function startNewPath() {
    const strokeColor = getStrokeColorBasedOnSpeed(speed); // Get color based on current speed
    currentPath = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: strokeColor,
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    currentPath.setMap(map);
}

function updateMapCenter() {
    if (LAT && LON) {
        const newCenter = { lat: parseFloat(LAT), lng: parseFloat(LON) };

        // Update the map's center position
        map.setCenter(newCenter);

        // Update the marker's position
        marker.setPosition(newCenter);

        // Only add new position to the route if GPSON is 1
        if (GPSON === 1) {
            if (!currentPath) {
                startNewPath(); // Start a new path if GPSON is 1 and no path is currently active
            }
            // Add the new point to the current path
            const pathCoordinates = currentPath.getPath();
            pathCoordinates.push(newCenter);
            currentPath.setPath(pathCoordinates); // Update the path
        }
    }
}
