var coordinateMapType;
var map;

/** tiles **/

function CoordMapType() {
}

CoordMapType.prototype.tileSize = new google.maps.Size(256,256);
CoordMapType.prototype.maxZoom = 19;

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('DIV');
//console.log("url(/mapcoord/"+coord.x+"_"+coord.y+".png)");
  div.innerHTML = coord;
  div.style.backgroundImage = "url(/images/map/ew_"+coord.x+"_"+coord.y+".jpg)";
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '10';
  div.style.overflow = "hidden";
  div.style.textIndent = "-999px";
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


    var boxText = document.createElement("div");
        boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
        boxText.innerHTML = "City Hall, Sechelt<br>British Columbia<br>Canada";


    map = new google.maps.Map(jQuery('#' + id).get(0), {
        maxZoom: 5,		// Don't zoom in too far!
        minZoom: 5,		// Don't zoom in too far!
        streetViewControl: false,
//	mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeId: 'coordinate',
        panControl: false,
        zoomControl: false,
        scaleControl: false,
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    	mapTypeControlOptions: {
          mapTypeIds: ['coordinate', google.maps.MapTypeId.ROADMAP]
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
    drawLines(points,map);
}
function drawLines(points,map)
{
  var flightPlanCoordinates = [];
  for(var i = 0; i < points.length; i++)
  {
    flightPlanCoordinates.push(new google.maps.LatLng(points[i]['lat'],points[i]['long'])); 
  }
 var flightPath = new google.maps.Polyline({
             path: flightPlanCoordinates,
               geodesic: true,
               strokeColor: "#3D7CAA",
               strokeOpacity: 0.2,
               strokeWeight: 4
           });
      
flightPath.setMap(map);

  google.maps.event.addListener(flightPath,'mouseover',function()
      {
          this.strokeOpacity = 1;
        flightPath.setMap(map);
      });
  google.maps.event.addListener(flightPath,'mouseout',function()
      {
          this.strokeOpacity = 0.2;
        flightPath.setMap(map);
      });
}

var infobox;
function newBox(html)
{
    infobox = new InfoBox({
			 content: html
			,disableAutoPan: false
			,maxWidth: 0
			,pixelOffset: new google.maps.Size(8, -35)
			,zIndex: null
			,boxStyle: { 
			  background: "url('images/infobox.png') no-repeat"
			  ,opacity: 0.95
			  ,width: "311px"
			  ,height: "140px"
			 }
			,closeBoxMargin: "10px 10px 2px 2px"
			,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
			,infoBoxClearance: new google.maps.Size(1, 1)
			,isHidden: false
			,pane: "floatPane"
			,enableEventPropagation: false
		});
    
}
function mapPoints(points, map) {
    var markers = {};
    var bounds = new google.maps.LatLngBounds();
    infowindow = new google.maps.InfoWindow();

    var image = new google.maps.MarkerImage('images/marker.png',
                    new google.maps.Size(20, 24),
                    new google.maps.Point(0,0),
                    new google.maps.Point(8, 24));

     var shadow = new google.maps.MarkerImage("images/shadow-marker.png",
                 new google.maps.Size(33.0, 24.0),
                 new google.maps.Point(0, 0),
                 new google.maps.Point(8.0, 20.0));
    for (var p = 0; p < points.length; p++) {
	var key = points[p]['lat'] + ',' + points[p]['long'];
	if (markers[key]) {

	} else {
	    var latlng = new google.maps.LatLng(points[p]['lat'],
						points[p]['long']);

            markers[key] = new google.maps.Marker({
		position: latlng,
		map: map,
                shadow: shadow,
                icon: image,
		title: points[p]['title']
	    });

	    var html = "<h2>"+points[p]['title']+"</h2>"+
                       "<p>"+points[p]['description']+"</p>";
	    markers[key]['content'] = html;

	    google.maps.event.addListener(markers[key], 'click', function() {
            if (infobox != undefined)
                infobox.close();
            newBox('<div class="infobox">'+this['content']+"</div>");
            infobox.open(map, this);
	    });

	    bounds.extend(latlng);
	}
    }

    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
}
