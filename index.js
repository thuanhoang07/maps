let map;
let marker;
let path;
let pathCoordinates = [];
let LAT = 10.8420797;  
let LON = 106.7090958; 

function initMap() {
    const options = {
        zoom: 14,
        center: { lat: LAT, lng: LON } 
    }

    // Khởi tạo bản đồ
    map = new google.maps.Map(document.getElementById('map'), options);

    // Đặt marker ban đầu
    marker = new google.maps.Marker({
        position: { lat: LAT, lng: LON },
        map: map
    });

    // Khởi tạo đối tượng Polyline để vẽ đường đi
    path = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });

    path.setMap(map);

    // Cập nhật tọa độ của map và marker liên tục mỗi giây
    setInterval(updateMapCenter, 1000);
}

function updateMapCenter() {
    if (LAT && LON) {
        const newCenter = { lat: parseFloat(LAT), lng: parseFloat(LON) };

        // Cập nhật vị trí trung tâm của map
        map.setCenter(newCenter);

        // Cập nhật vị trí của marker
        marker.setPosition(newCenter);

        // Thêm vị trí mới vào tuyến đường
        pathCoordinates.push(newCenter);
        path.setPath(pathCoordinates); // Cập nhật đường đi
    }
}
