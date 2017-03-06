/* 	find_vehicles.js
	created by: 	John C. Merfeld
	last modifeid: 	3 / 6 / 2017

		Loads a google map, gets user's location, checks the server
	for nearby passengers and vehicles and displays how far away they
	are

*/

var myUsername = "We1HUtFX"; // given by Ming
var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
			zoom: 13, // The larger the zoom number, the bigger the zoom
			center: me,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'; // possible use later
var map;
var marker;
var myInfowindow = new google.maps.InfoWindow();
var infowindow = new google.maps.InfoWindow();

// calculate distance between user and cars/passengers
function haversineDistance(lat1,lng1,lat2,lng2, isMiles) {
  	function toRad(x) {
    	return x * Math.PI / 180;
  	}

  	var R = 6371; // km

  	var x1 = lat2 - lat1;
  	var dLat = toRad(x1);
  	var x2 = lng2 - lng1;
  	var dLon = toRad(x2)
  	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    	Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    	Math.sin(dLon / 2) * Math.sin(dLon / 2);
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  	var d = R * c;

  	if(isMiles) d /= 1.60934;

	// round to nearest .01 mi
  	return d.toFixed(2);
}

//initialization for the html
function init(){
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

// use geolocation object and render map
function getMyLocation() {
	if (navigator.geolocation) { // geolocation is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.");
	}
}

// find cars/passengers and add them to map
function renderMap(){
	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there
	map.panTo(me);

	myMarker = new google.maps.Marker({
		position: me,
		map: map,
		title: myUsername,
		icon: 'JohnCMerfeldHeadshotSmall.png'
	});
	myMarker.setMap(map);

	// instantiate helper variables
	var jsonUser = "username=";
	var params = jsonUser.concat(myUsername,"&lat=",myLat,"&lng=",myLng);
	var url = "https://defense-in-derpth.herokuapp.com/submit";

	// instantiate request
	var xhr = new XMLHttpRequest();
	// set up request
	xhr.open("POST", url, true);
	// header information
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// handler function
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			elements = JSON.parse(xhr.responseText);
			// create vehicle markers
			console.log(elements);

			// check for passengers
			if (elements.passengers != null) {
				for (var i=0;i<elements.passengers.length;i++) {
					data = elements.passengers[i];
					latLng = new google.maps.LatLng(data.lat, data.lng);
					distanceToMe = haversineDistance(data.lat,data.lng,myLat,myLng,true);

					marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: data.username,
						content: data.username + ": " + distanceToMe +" miles away",
						icon: 'creepy-smile.png'
					});

					//Open info window on click of marker
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.setContent(this.content);
						infowindow.open(map, this);
					});

				} // end for loop
			}

			// check for vehicles
			if (elements.vehicles != null) {
				for (var i=0;i<elements.vehicles.length;i++) {
					data = elements.vehicles[i];
					latLng = new google.maps.LatLng(data.lat, data.lng);
					distanceToMe = haversineDistance(data.lat,data.lng,myLat,myLng,true);

					marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: data.username,
						content: data.username + ": " + distanceToMe +" miles away",
						icon: 'black_car.png'
					});

					//Open info window on click of marker
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.setContent(this.content);
						infowindow.open(map, this);
					});

				} // end for loop
			} // end if
		} // end if successful
	}; // end onreadystatechange
	xhr.send(params);

	// click support for user's marker
	google.maps.event.addListener(myMarker, 'click', function() {
		infowindow.setContent(myMarker.title);
		infowindow.open(map, myMarker);
	});
}
