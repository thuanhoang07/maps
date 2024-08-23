let map;
let marker;
let currentPath;
let currentColor;
let pathCoordinates = [];
let LAT;  
let LON; 
let SPEED;
let DELETE;
let GPSON = 0; // Assuming this variable is defined elsewhere
let lastPosition = null; // To store the last known position when GPSON is 1
let speedMarkers = []; // To store all speed markers

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

        // If GPSON is 1, add new position to the route
        if (GPSON === 1) {
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

                // Display the speed at the start of the new segment
                displaySpeedMarker(newCenter, SPEED);
            }

            // Add the new point to the current path
            pathCoordinates.push(newCenter);
            currentPath.setPath(pathCoordinates); // Update the path with the new coordinates
            
            // Update the last position
            lastPosition = newCenter;
        } else {
            // If GPSON is 0, finalize the current path segment and clear all speed markers
            if (currentPath) {
                currentPath.setPath(pathCoordinates);
            }
            clearSpeedMarkers(); // Clear all speed markers when GPSON is turned off
            // Reset last position when GPSON is turned off
            lastPosition = null;
        }
    }
}

function displaySpeedMarker(position, speed) {
    const marker = new google.maps.Marker({
        position: { lat: position.lat + 0.002, lng: position.lng + 0.002 }, // Adjusting the position slightly to the right
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE, // Default marker shape
            scale: 0, // Set scale to 0 to make the marker invisible
        },
        label: {
            text: `${speed} km/h`,
            color: 'black',
            fontSize: '10px', // Increase font size to 10px
            fontWeight: 'bold',
            className: 'speed-label' // Custom CSS class for additional styling
        }
    });
    speedMarkers.push(marker); // Store the marker so we can clear it later
}




function clearSpeedMarkers() {
    // Remove all speed markers from the map
    speedMarkers.forEach(marker => marker.setMap(null));
    speedMarkers = []; // Clear the array
}
