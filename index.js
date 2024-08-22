let map;
let marker;
let LAT = 20.028511;  
let LON = 105.804817; 

function initMap() {
    const options = {
        zoom: 14,
        center: { lat: LAT, lng: LON } 
    }

    map = new google.maps.Map(document.getElementById('map'), options);

    // Đặt marker ban đầu
    marker = new google.maps.Marker({
        position: { lat: LAT, lng: LON },
        map: map
    });

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
    }
}
