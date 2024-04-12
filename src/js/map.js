(function() {
    
    const lat = document.querySelector('#lat').value || -31.4159171;
    const lng = document.querySelector('#lng').value || -64.4894222;
    const map = L.map('map').setView([lat, lng ], 16);
    let marker;

    //provider - geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //pin
    marker = new L.marker([lat,lng], {
        draggable:true,
        autoPan:true
    })
    .addTo(map)

    //detect pin movement
    marker.on('moveend', function(e){
        marker = e.target;
        const position = marker.getLatLng();
        //console.log(position);
        map.panTo(new L.LatLng(position.lat, position.lng))

        //information from the adress when releasing the pin
        geocodeService.reverse().latlng(position, 16).run(function(error, result){
            marker.bindPopup(result.address.LongLabel)

            //llenar los campos
            document.querySelector('.street').textContent = result?.address?.Address ?? '';
            document.querySelector('#street').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? '';
            
        })
    })

})()