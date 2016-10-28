// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


var map;
var pyrmont = {lat: -33.866, lng: 151.196};
var markers = [];
var service;

function initialization(){
   map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15,
      mapTypeId: 'roadmap'
    });

   infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: pyrmont,
      radius: 500,
      type: ['school', 'store']
    }, processResults);
}


function initAutocomplete() {

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');

  if (input.value == '') {
    initialization();
  }
  var searchBox = new google.maps.places.SearchBox(input);
 console.log(map.zoom);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      service.nearbySearch({
        location: place.geometry.location,
        radius: 500,
        type: ['school', 'store']
      }, processResults);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

function processResults(results, status, pagination) {
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById('places');

  map.setZoom(15);

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);

    }

     if (pagination.hasNextPage) {
      var moreButton = document.getElementById('more');

      moreButton.disabled = false;

      moreButton.addEventListener('click', function() {
        moreButton.disabled = true;
        pagination.nextPage();
      });
    }
    var places = results;
    for (var i = 0, place; place = places[i]; i++) {

      placesList.innerHTML += '<li>' + place.name + '</li>';

      bounds.extend(place.geometry.location);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    icon: 'http://maps.google.com/mapfiles/ms/micons/yellow-dot.png',
    position: place.geometry.location
  });

  var green = document.getElementById('green');
  var red = document.getElementById('red');
  var blue = document.getElementById('blue');

  google.maps.event.addDomListener(blue, 'click', function(){
        var marker = new google.maps.Marker({
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png',
          title: place.name,
          position: place.geometry.location
        });
    });

  google.maps.event.addDomListener(green, 'click', function(){
        var marker = new google.maps.Marker({
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          title: place.name,
          position: place.geometry.location
        });
    });
    google.maps.event.addDomListener(red, 'click', function(){
        var marker = new google.maps.Marker({
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/micons/red-dot.png',
          title: place.name,
          position: place.geometry.location
        });
    });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}