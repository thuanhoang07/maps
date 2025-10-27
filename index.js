let map;
let marker;
// let path; // Đã xóa
// let pathCoordinates = []; // Đã xóa
let LAT;  
let LON; 

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

    /*
     * Đã xóa khối code khởi tạo 'path' (google.maps.Polyline)
     * và 'path.setMap(map)'
     */

    // Cập nhật tọa độ của map và marker liên tục mỗi giây
    setInterval(updateMapCenter, 5000);
}

function updateMapCenter() {
    if (LAT && LON) {
        const newCenter = { lat: parseFloat(LAT), lng: parseFloat(LON) };

        // Cập nhật vị trí trung tâm của map
        map.setCenter(newCenter);

        // Cập nhật vị trí của marker
        marker.setPosition(newCenter);

        // Đã xóa 2 dòng code cập nhật đường đi (path)
        // pathCoordinates.push(newCenter);
        // path.setPath(pathCoordinates);
    }
}