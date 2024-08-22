let map;
let marker;
let path;
let pathCoordinates = [];
let LAT;  // Không khởi tạo giá trị ban đầu
let LON;  // Không khởi tạo giá trị ban đầu

function initMap() {
    // Chỉ khởi tạo bản đồ và các đối tượng liên quan khi có giá trị LAT và LON
    if (LAT && LON) {
        const options = {
            zoom: 14,
            center: { lat: LAT, lng: LON } // Sử dụng LAT và LON nhận được
        };

        // Khởi tạo bản đồ
        map = new google.maps.Map(document.getElementById('map'), options);

        // Đặt marker ban đầu tại vị trí đầu tiên nhận được
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

        // Bắt đầu cập nhật vị trí liên tục
        setInterval(updateMapCenter, 1000);
    } else {
        console.log("Chưa có giá trị LAT và LON, đang chờ...");
    }
}

function updateMapCenter() {
    // Kiểm tra nếu LAT và LON đã có giá trị
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

// Hàm này được gọi khi có dữ liệu GPS mới
function updateGPSData(newLat, newLon) {
    LAT = newLat;
    LON = newLon;

    // Chỉ khởi động bản đồ khi đã nhận được LAT và LON lần đầu tiên
    if (!map) {
        initMap();
    }
}
