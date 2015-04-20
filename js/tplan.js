var planner = {
    openAddProductModal: function() {
        $('#add-product-modal').modal();
    },

    addModalInit: function() {
        //$('#start-time').timepicker();
        //$('#end-time').timepicker();
    },

    addSpot: function() {
        var st = $("#start-time").val();
        var et = $("#end-time").val();
        var loc = $("#pac-input").val();
        alert(st+","+et+","+loc);
    },

    mapInit: function() {
        var markers = [];
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            center: new google.maps.LatLng(40.442493, -79.942553),
            zoom:15
        });

        // Create the search box and link it to the UI element.
        var input = /** @type {HTMLInputElement} */(
            document.getElementById('pac-input'));
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

            var searchBox = new google.maps.places.SearchBox(
                /** @type {HTMLInputElement} */(input));

                // Listen for the event fired when the user selects an item from the
                // pick list. Retrieve the matching places for that item.
                google.maps.event.addListener(searchBox, 'places_changed', function() {
                    var places = searchBox.getPlaces();

                    for (var i = 0, marker; marker = markers[i]; i++) {
                        marker.setMap(null);
                    }

                    // For each place, get the icon, place name, and location.
                    markers = [];
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0, place; place = places[i]; i++) {
                        var placeLoc = place.geometry.location;
                        $("#np_location").val($("#pac-input").val());
                        $("#np_location_lat").val(placeLoc.lat());
                        $("#np_location_lng").val(placeLoc.lng());
                        var image = {
                            url: place.icon,
                            size: new google.maps.Size(71, 71),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(17, 34),
                            scaledSize: new google.maps.Size(25, 25)
                        };

                        // Create a marker for each place.
                        var marker = new google.maps.Marker({
                            map: map,
                            // use the default icon           icon: image,
                            title: place.name,
                            position: place.geometry.location
                        });

                        markers.push(marker);

                        bounds.extend(place.geometry.location);
                        // only get the first result
                        break;
                    }

                    map.fitBounds(bounds);
                    map.setZoom(15);
                });

                // Bias the SearchBox results towards places that are within the bounds of the
                // current map's viewport.

                google.maps.event.addListener(map, 'bounds_changed', function() {
                    var bounds = map.getBounds();
                    searchBox.setBounds(bounds);
                });
                $('#add-product-modal').on('shown.bs.modal', function () {
                    google.maps.event.trigger(map, "resize");
                });
    },

    newMap: function(id, lat, lng) {
        var myLatlng = new google.maps.LatLng(lat,lng);
        var mapOptions = {
            zoom: 15,
            center: myLatlng
        }
        var map = new google.maps.Map(document.getElementById(id), mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
        });
    }
};
