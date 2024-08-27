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

function interpolateColor(color1, color2, factor) {
    return [
        Math.round(color1[0] + factor * (color2[0] - color1[0])),
        Math.round(color1[1] + factor * (color2[1] - color1[1])),
        Math.round(color1[2] + factor * (color2[2] - color1[2]))
    ];
}

function getRainbowColorForSpeed(speed) {
    const colors = [
        [255, 0, 0],    // Red
        [255, 165, 0],  // Orange
        [255, 255, 0],  // Yellow
        [0, 255, 0],    // Green
        [0, 0, 255],    // Blue
        [75, 0, 130],   // Indigo
        [238, 130, 238] // Violet
    ];

    const numColors = colors.length;
    const maxSpeed = 100;
    const segment = maxSpeed / (numColors - 1); // Divide speed into segments based on color range

    let startColorIndex = Math.floor(speed / segment);
    let endColorIndex = startColorIndex + 1;

    if (endColorIndex >= numColors) {
        endColorIndex = numColors - 1;
    }

    const factor = (speed % segment) / segment;
    const [r, g, b] = interpolateColor(colors[startColorIndex], colors[endColorIndex], factor);

    return `rgb(${r}, ${g}, ${b})`;
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
            const strokeColor = getRainbowColorForSpeed(SPEED);

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
