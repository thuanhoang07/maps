let map;
let marker;
let currentPath;
let currentColor;
let pathCoordinates = [];
let LAT = 0;  // Initialize with default value
let LON = 0;  // Initialize with default value
let SPEED = 0;  // Initialize with default value
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
    const maxSpeed = 100;

    const colors = [
        { stop: 0, color: [0, 0, 255] },     // Blue
        { stop: 20, color: [0, 128, 0] },    // Green
        { stop: 40, color: [255, 0, 0] },    // Red
        { stop: 60, color: [128, 0, 128] },  // Purple
        { stop: 80, color: [0, 0, 0] }       // Black
    ];

    function interpolateColor(color1, color2, factor) {
        return [
            Math.round(color1[0] + factor * (color2[0] - color1[0])),
            Math.round(color1[1] + factor * (color2[1] - color1[1])),
            Math.round(color1[2] + factor * (color2[2] - color1[2]))
        ];
    }

    function getColorForSpeed(speed) {
        for (let i = 0; i < colors.length - 1; i++) {
            const start = colors[i];
            const end = colors[i + 1];
            if (speed <= end.stop) {
                const factor = (speed - start.stop) / (end.stop - start.stop);
                const [r, g, b] = interpolateColor(start.color, end.color, factor);
                return `rgb(${r}, ${g}, ${b})`;
            }
        }

        return `rgb(${colors[colors.length - 1].color.join(', ')})`;
    }

    if (speed > maxSpeed) speed = maxSpeed;
    return getColorForSpeed(speed);
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
        position: { lat: position.lat, lng: position.lng }, // Marker at position
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
