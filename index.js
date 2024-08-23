let map;
let marker;
let currentPath;
let currentColor;
let pathCoordinates = [];
let LAT;  
let LON; 
let SPEED;
let DELETE = 0; // Assuming this variable is defined elsewhere
let GPSON = 0; // Assuming this variable is defined elsewhere
let lastPosition = null; // To store the last known position when GPSON is 1

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

        // If DELETE is 1, do not draw any paths, just update the map center and marker
        if (DELETE === 1) {
            clearPaths(); // Clear existing paths
            return; // Exit to avoid any drawing
        }

        // If DELETE is 0 and GPSON is 1, proceed to draw paths
        if (GPSON === 1 && DELETE === 0) {
            const strokeColor = getStrokeColorBasedOnSpeed(SPEED);

            // If the path color has changed or a new path is needed, start a new segment
            if (!currentPath || strokeColor !== currentColor) {
                if (pathCoordinates.length > 0) {
                    currentPath.setPath(pathCoordinates); // Finalize the previous segment
                }
                if (lastPosition) {
                    pathCoordinates = [lastPosition]; // Start the new segment with the last point
                } else {
                    pathCoordinates = [];
                }
                currentColor = strokeColor;
                initializePath(strokeColor);
            }

            // Add the new point to the current path
            pathCoordinates.push(newCenter);
            currentPath.setPath(pathCoordinates); // Update the path with the new coordinates
            
            // Update the last position
            lastPosition = newCenter;
        } else {
            // If GPSON is 0, finalize the current path segment
            if (currentPath) {
                currentPath.setPath(pathCoordinates);
            }
            // Reset last position when GPSON is turned off
            lastPosition = null;
        }
    }
}

function clearPaths() {
    // Clear the current path
    if (currentPath) {
        currentPath.setMap(null); // Remove the current path from the map
    }

    // Reset all variables related to the path
    currentPath = null;
    currentColor = null;
    pathCoordinates = [];
    lastPosition = null;
}

