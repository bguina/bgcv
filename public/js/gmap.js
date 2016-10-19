var gmap = (function() {
  var _target = null;
  var _map = null;
  var _usrtouched = false;
  var _opts = null;

  jQuery(function() {
    var block = $('#showblock-content');
    gmap.config(block, $.parseJSON(block.attr('data-gmap-options')));
  });

  return {
    config: function(target_hash, options) {
      _target = target_hash;
      _opts = options;
    },
    load: function() {
      try {
        if (_opts) {
          if (!_map) {
            var center = _opts.center,
              marker = _opts.marker;
            _opts.center = new google.maps.LatLng(center[0], center[1]);
            _map = new google.maps.Map(_target[0], _opts);
            _target.addClass('content');
            _target.css('marginTop', '2em');
            _target.css('paddingBottom', '22%');
            _target.css('display', 'block');
            // Keep the view pan near the center
            var bbox = new google.maps.LatLngBounds(
              new google.maps.LatLng(center[0]-.15, center[1]-.15), 
              new google.maps.LatLng(center[0]+.15, center[1]+.15)
            );
            google.maps.event.addListener(_map, 'dragend', function() {
              if (bbox.contains(_map.getCenter())) { return; }
              var c = _map.getCenter(), x = c.lng(), y = c.lat(),
              maxX = bbox.getNorthEast().lng(),
              maxY = bbox.getNorthEast().lat(),
              minX = bbox.getSouthWest().lng(),
              minY = bbox.getSouthWest().lat();
              if (x < minX) x = minX;
              if (x > maxX) x = maxX;
              if (y < minY) y = minY;
              if (y > maxY) y = maxY;
              _map.setCenter(new google.maps.LatLng(y, x));
            });

            // Limit the zoom level
            google.maps.event.addListener(_map, 'zoom_changed', function() {
              if (_map.getZoom() < 7) _map.setZoom(7);
            });

            // Resize watcher
            $(window).resize($.debounce(250, function() {
              if (!_usrtouched) { _map.setCenter(_opts.center); }
            }));
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(marker.position[0],marker.position[1]),
              map: _map,
              title: 'Benoit Guina',
            });
          } else {
            _map.setCenter(_opts.center);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
  };
}());

