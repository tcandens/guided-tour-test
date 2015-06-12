'use strict';

var _ = require('underscore');

var map;

function loadScript( url ) {
  var script = document.createElement('script');
  script.src = url;
  document.body.appendChild( script );
};

function initializeMap( position, callback ) {
  var options = {
    zoom: 20,
    center: new google.maps.LatLng( position.latitude, position.longitude )
  };
  map = new google.maps.Map( document.getElementById('map-canvas'), options );
  var startMarker = new google.maps.Marker({
    position: new google.maps.LatLng( position.latitude, position.longitude ),
    map: map,
    title: 'Start'
  });
  if ( typeof( callback ) === 'function' ) {
    callback( map );
  }
}

function moveCenter( position, map ) {
  var newCenter = new google.maps.LatLng( position.latitude, position.longitude );
  map.setCenter( newCenter );
  var newMarker = new google.maps.Marker({
    position: newCenter,
    map: map,
    title: position.latitude + '-' + position.longitude
  });
}

function geolocate( callback ) {
  if ( navigator.geolocation ) {
    navigator.geolocation.watchPosition(function( position ) {
      if ( typeof( callback ) === 'function' ) {
        callback( position.coords );
        console.log( 'callback fired in geolocate' );
      } else {
        console.log( typeof( callback ) );
        console.log( 'No callback in geolocate' );
      }
    });
  } else {
    document.write('no geolocation!');
  }
}

function launchMap() {
  geolocate(function( position ) {
    initializeMap( position, function( map ) {
      moveCenter( position, map );
    });
  });
}

window.onload = function() {
  var url = 'https://maps.googleapis.com/maps/api/js?v=3.20&callback=APP.launchMap';
  loadScript( url );
}

window.APP = {
  launchMap: launchMap
}
