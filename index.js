let map;
let marker;
let currentPath;
let currentColor;
let pathCoordinates = [];
let LAT = 0; 
let LON = 0;  
let SPEED = 0; 

let GPSON = 0; 
let lastPosition = null; 


document.getElementById('button1').addEventListener('click', function() {
    document.getElementById('map').style.display = 'block'; // Hiển thị bản đồ khi nhấn Phím 1
    initMap(); // Khởi tạo bản đồ và các chức năng
});

document.getElementById('button2').addEventListener('click', function() {
    document.getElementById('map').style.display = 'none'; // Ẩn bản đồ khi nhấn Phím 2
});


function initMap() {
    const options = {
        zoom: 14,
        center: { lat: LAT, lng: LON }
    };

    map = new google.maps.Map(document.getElementById('map'), options);

    marker = new google.maps.Marker({
        position: { lat: LAT, lng: LON },
        map: map
    });

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

        if (GPSON === 1) {
            const strokeColor = getRainbowColorForSpeed(SPEED);

            // Start a new path segment if needed
            if (!currentPath || strokeColor !== currentColor) {
                if (pathCoordinates.length > 0) {
                    currentPath.setPath(pathCoordinates); // Finalize the previous segment
                }
                pathCoordinates = lastPosition ? [lastPosition] : [];
                currentColor = strokeColor;
                initializePath(strokeColor);
            }

            // Add the new point to the current path
            pathCoordinates.push(newCenter);
            currentPath.setPath(pathCoordinates); // Update the path with the new coordinates
            
            // Update the last position
            lastPosition = newCenter;
        } else {
            // Finalize the current path segment if GPSON is 0
            if (currentPath) {
                currentPath.setPath(pathCoordinates);
            }
            lastPosition = null; // Reset last position when GPSON is turned off
        }
    }
}
