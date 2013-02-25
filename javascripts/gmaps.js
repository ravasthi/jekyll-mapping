window.maps = window.maps || [];

var jekyllMapping = (function () {
    return {
        mappingInitialize: function () {
            var maps = document.getElementsByClassName("jekyll-mapping");
            for ( var i = 0; i < maps.length; i++ ) {
                var zoom      = maps[i].getAttribute("data-zoom"),
                    lat       = maps[i].getAttribute("data-latitude"),
                    lon       = maps[i].getAttribute("data-longitude"),
                    locations = maps[i].getAttribute("data-locations"),
                    layers    = maps[i].getAttribute("data-layers"),
                    title     = maps[i].getAttribute("data-title"),
                    options   = {
                        zoom      : parseFloat(zoom),
                        mapTypeId : google.maps.MapTypeId.ROADMAP
                    },
                    mainMarker;

                if (lat  && lon) {
                    options.center = new google.maps.LatLng(lat, lon);
                    map = new google.maps.Map(maps[i], options);
                    window.maps.push(map);
                    mainMarker = new google.maps.Marker({
                        position  : options.center,
                        map       : map,
                        title     : title,
                        icon      : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    });
                } else {
                    options.center = new google.maps.LatLng(0, 0);
                    map = new google.maps.Map(maps[i], options);
                    window.maps.push(map);
                }

                if (locations) {
                    locations = JSON.parse(locations);
                    var bounds = new google.maps.LatLngBounds(),
                        markers = [],
                        slice,
                        coordinate,
                        marker;
                    while (locations.length > 0) {
                        slice      = locations.pop();
                        coordinate = new google.maps.LatLng(slice.latitude, slice.longitude);
                        marker     = new google.maps.Marker({
                            position  : coordinate,
                            map       : map,
                            title     : slice.title
                        });
                        if (slice.main) {
                          marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                        }
                        markers.push(marker);
                        bounds.extend(coordinate);
                    }
                    map.fitBounds(bounds);
                }

                if (layers) {
                    layers = layers.split(' ');
                    var mapLayers = [];
                    while (layers.length > 0){
                        var m = new google.maps.KmlLayer(layers.pop());
                        mapLayers.push(m);
                        m.setMap(map);
                    }
                }
            }
        },
        loadScript: function () {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://maps.googleapis.com/maps/api/js?key=" +
                jekyllMappingAPIKey +
                "&sensor=false&callback=jekyllMapping.mappingInitialize";
            document.body.appendChild(script);
        }
    };
}());

window.onload = function() { jekyllMapping.loadScript(); };
