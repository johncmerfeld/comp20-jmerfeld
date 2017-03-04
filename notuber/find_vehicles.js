var myUsername = "We1HUtFX"; // given by Ming
var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
			zoom: 13, // The larger the zoom number, the bigger the zoom
			center: me,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}
function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there...
	map.panTo(me);

	// Create a marker
	var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

	myMarker = new google.maps.Marker({
		position: me,
		map: map,
		title: myUsername
		//TODO: icon: JohnCMerfeldHeadshotSmall.jpg
	});
	//myMarker.setMap(map);

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
			for (var i=0;i<elements.vehicles.length;i++) {
				data = elements.vehicles[i];
				console.log(data.username);
				console.log(data.lat);
				console.log(data.lng);

				latLng = new google.maps.LatLng(data.lat, data.lng);

				marker = new google.maps.Marker({
					position: latLng,
					map: map,
					title: data.username
				});
			}
		}
	};
	xhr.send(params);

	infowindow.setContent(myMarker.title);
	infowindow.open(map, myMarker);

	/* Open info window on click of marker
	google.maps.event.addListener(myMarker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	}); */
}
