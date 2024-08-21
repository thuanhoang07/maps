function initMap() {
    const options = {
        zoom: 14,  // Reduced zoom level
        center: { lat: 21.028511, lng: 105.804817 }  // Trung tâm TP HCM
    }

    map = new google.maps.Map(
        document.getElementById('map'),
        options
    )

    // Listen to map click
    google.maps.event.addListener(map, 'click', function (event) {
        addMarker({
            coordinates: event.latLng
        })
    })

    for (let i = 0; i < markers.length; i++) {
        addMarker(markers[i])
    }

    drawDirection()
}
