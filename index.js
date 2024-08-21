let map;

// Array of markers
let markers = [
    {
        coordinates: { lat: 21.028511, lng: 105.804817 },  // Tọa độ TP HCM
        iconImage: 'https://img.icons8.com/fluent/48/000000/marker-storm.png',
        content: '<h4>TP Hồ Chí Minh</h4>'
    },
    {
        coordinates: { lat: 21.028511, lng: 105.804817 }  // Một vị trí khác ở TP HCM
    }
]

function initMap() {
    const options = {
        zoom: 16,
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

    for (let i = 0; i< markers.length; i++) {
        addMarker(markers[i])
    }

    drawDirection()

}

function addMarker(prop) {
    let marker = new google.maps.Marker({
        position: prop.coordinates,
        map: map
    })

    if( prop.iconImage ) {
        marker.setIcon(prop.iconImage)
    }

    if( prop.content ) {
        let information = new google.maps.InfoWindow({
            content: prop.content
        })

        marker.addListener("click", function () {
            information.open(map, marker)
        })
    }
}

function drawDirection() {
    const directionService = new google.maps.DirectionsService();
    const directionRenderer = new google.maps.DirectionsRenderer();

    directionRenderer.setMap(map)

    calculationAndDisplayRoute(directionService, directionRenderer)

}

function calculationAndDisplayRoute(directionService, directionRenderer) {
    const start = { lat: 21.028511, lng: 105.804817 };  // Điểm bắt đầu ở TP HCM
    const end = { lat: 21.028511, lng: 105.804817 };    // Điểm kết thúc ở TP HCM
    const request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    }

    directionService.route(request, function (response, status) {
       if( status === google.maps.DirectionsStatus.OK ) {
           directionRenderer.setDirections(response)
           let myRoute = response.routes[0]
           let txt = ''
           for (let i = 0; i < myRoute.legs[0].steps.length; i++) {
               txt += myRoute.legs[0].steps[i].instructions + "<br />"
           }

           document.getElementById('directions').innerHTML = txt

       }
    });

}
