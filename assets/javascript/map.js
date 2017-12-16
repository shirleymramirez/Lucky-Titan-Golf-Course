 function initMap() {
        var myLatLng = {lat: 33.356245, lng: -111.792011};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: myLatLng
        });
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: "Lucky Titan Golf Course"
        });
      }

     

     

