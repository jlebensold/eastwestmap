var coordinateMapType;
var map;

/** tiles **/

function CoordMapType() {
}

CoordMapType.prototype.tileSize = new google.maps.Size(256,256);
CoordMapType.prototype.maxZoom = 19;

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('DIV');
  console.log("url(/mapcoord/"+coord.x+"_"+coord.y+".png)");
  div.innerHTML = coord;
  div.style.backgroundImage = "url(/mapcoord/"+coord.x+"_"+coord.y+".png)";
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '10';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.borderColor = '#FF0000';
  return div;
};

CoordMapType.prototype.name = "Tile #s";
CoordMapType.prototype.alt = "Tile Coordinate Map Type";

coordinateMapType = new CoordMapType();

$(function()
{
    initMapJS(points, "map");
}); 
 
function initMapJS(points, id) {
    if(jQuery('#' + id).length == 0) // no MapCanvas element found
	return;

    map = new google.maps.Map(jQuery('#' + id).get(0), {
	maxZoom: 5,		// Don't zoom in too far!
	minZoom: 5,		// Don't zoom in too far!
        streetViewControl: false,
//	mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeId: 'coordinate',
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
	mapTypeControlOptions: {
	    mapTypeIds: []
	}
    });
 
    google.maps.event.addListener(map, 'maptypeid_changed', function() {
    var showStreetViewControl = map.getMapTypeId() != 'coordinate';
    map.setOptions({'streetViewControl': showStreetViewControl});
    });

    // Now attach the coordinate map type to the map's registry
    map.mapTypes.set('coordinate', coordinateMapType);
    
    
    map.setCenter(new google.maps.LatLng(0,0),0);

    mapPoints(points, map);
}

function mapPoints(points, map) {
    var markers = {};
    var bounds = new google.maps.LatLngBounds();
    infowindow = new google.maps.InfoWindow();

    for (var p = 0; p < points.length; p++) {
	var key = points[p]['lat'] + ',' + points[p]['long'];
	if (markers[key]) {

	} else {
	    var latlng = new google.maps.LatLng(points[p]['lat'],
						points[p]['long']);

            markers[key] = new google.maps.Marker({
		position: latlng,
		map: map,
		title: points[p]['title']
	    });

	    markers[key]['content'] = points[p]['description']

	    google.maps.event.addListener(markers[key], 'click', function() {
		infowindow.setContent(this['content']);
		infowindow.open(map, this);
	    });

	    bounds.extend(latlng);
	}
    }

    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
}
