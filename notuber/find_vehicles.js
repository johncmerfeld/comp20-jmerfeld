var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
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

	marker = new google.maps.Marker({
		position: me,
		map: map,
		title: "Here I Am!"
		icon: iconBase+'JohnCMerfeldHeadshot-small.jpg'
	});
	marker.setMap(map);

	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}

// instantiate helper variables
var myUsername = "We1HUtFX"; // given by Ming
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
		for (i=0;i<elements.vehicles.length;i++) {
			console.log(elements.vehicles[i].username);
			console.log(elements.vehicles[i].lat);
			console.log(elements.vehicles[i].lng);
		}
	}
};
xhr.send(params);
