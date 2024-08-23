let map;
let marker;
let currentPath;
let currentColor;
let pathCoordinates = [];
let LAT;  
let LON; 
let SPEED;
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

function initializePath(strokeColor) {
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

        // Add new position to the route if GPSON is 1
        if (GPSON === 1) {
            const strokeColor = getStrokeColorBasedOnSpeed(SPEED);

            // If there's no path or the color has changed, start a new segment
            if (!currentPath || strokeColor !== currentColor) {
                if (currentPath) {
                    currentPath.setPath(pathCoordinates); // Finalize the previous segment
                    pathCoordinates = []; // Start a new segment
                }
                currentColor = strokeColor; // Update the current color
                initializePath(strokeColor); // Initialize a new path with the new color
            }

            // Add the new point to the current path
            pathCoordinates.push(newCenter);
            currentPath.setPath(pathCoordinates); // Update the path with the new coordinates
        }
    }
}
