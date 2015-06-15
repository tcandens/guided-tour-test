'use strict';

var _ = require('underscore');
var geolib = require('geolib');

var map;

function loadScript( url ) {
  var script = document.createElement('script');
  script.src = url;
  document.body.appendChild( script );
};

function initializeMap( position, callback ) {
  var map = L.map('map-canvas', {
    center: [ position.latitude, position.longitude ],
    zoom: 19
  });
  L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data',
    maxZoom: 19
  }).addTo( map );
  callback( map, position );
}

function addMarker( map, position, callback ) {
  L.marker([ position.latitude, position.longitude ], {
    title: 'You started here'
  }).addTo( map );
  if ( typeof callback === 'function' )
    callback( map );
}

function geolocate( callback ) {
  if ( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition(function( position ) {
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

function isNearCoffee( position, callback ) {
  function _distance( x1, x2, y1, y2 ) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var hyp = Math.sqrt( ( deltaX * deltaX ) + ( deltaY * deltaY ) );
    return Math.abs( hyp );
  }

  var distance = geolib.getDistance(
    { latitude: 47.624094, longitude: -122.336750 },
    { latitude: position.latitude, longitude: position.longitude }
  )

  if( distance < 5 ) {
    window.alert( 'Here be coffee' );
  }

  console.log( distance );

}

function launchMap() {
  geolocate(function( position ) {
    initializeMap( position, function( map, position ) {
      isNearCoffee( position );
      addMarker( map, position, function( map ) {
        navigator.geolocation.watchPosition(function( position ) {
          addMarker( map, position );
          isNearCoffee( position );
          console.log( 'position changed!' );
        })
      })
    });
  });
}

window.onload = function() {
  var url = 'http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js';
  loadScript( url );
  launchMap();
}

window.APP = {
  launchMap: launchMap
}
