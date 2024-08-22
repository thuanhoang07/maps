let map;
let pathCoordinates = [];
let path;

function initMap() {
    const mapOptions = {
        zoom: 15, // Phóng to bản đồ
        center: { lat: LAT, lng: LON } // Tọa độ ban đầu từ biến LAT, LON
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    path = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });

    path.setMap(map);

    // Bắt đầu theo dõi và cập nhật đường đi
    startTracking();
}

function startTracking() {
    setInterval(updatePath, 1000); // Cập nhật đường đi mỗi giây (1000ms)
}

function updatePath() {
    if (LAT && LON) { // Kiểm tra xem LAT và LON có giá trị hợp lệ không
        const latLng = new google.maps.LatLng(LAT, LON);

        // Thêm vị trí mới vào tuyến đường
        pathCoordinates.push(latLng);
        path.setPath(pathCoordinates);

        // Di chuyển trung tâm bản đồ đến vị trí hiện tại
        map.setCenter(latLng);
    }
}
