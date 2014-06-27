Places.addPhotos = function(obj, uid) {
  ajax.post('al_places.php', {act: 'a_edit_photos', uid: uid}, {
    onDone: function(html, js, offset) {
      hide('places_edit_step_0');
      show('places_edit_step_1');
      hide('place_map_cont');
      cur.addPhotosOffset = offset;
      cur.editPhotosPlace = true;
      cur.placesFixedBottom = false;
      cur.mapPidsArray = {};
      var editCont = ge('place_map_edit');
      editCont.innerHTML = html;
      show(editCont);
      hide('place_map_other');
      cur.onPlaceScroll();
      if (js) {
        eval('(function() {'+js+'})();')
      }
    },
    showProgress: function() {
      lockButton(obj);
    },
    hideProgress: function() {
      unlockButton(obj);
    }
  })
};
Places.selectPhoto = function(pids, photoSrc) {
  cur.mapPidsArray[pids] = !cur.mapPidsArray[pids];
  ge('place_map_cont').parentNode.insertBefore(ge('place_map_point'),ge('place_map_edit'));

  if (event.currentTarget.innerHTML.indexOf('place_photo_over') == -1) {
    event.currentTarget.innerHTML = '<div class="place_photo_over" style="width: 130px; height: 83px; background-position: -11px -11px; margin: 0;"></div>' + event.currentTarget.innerHTML;
  }
  toggleClass(event.currentTarget, 'places_photo_checked');

  var pidsList = new Array();
  for (var pid in cur.mapPidsArray) {
    if (cur.mapPidsArray[pid]) {
      pidsList.push(pid);
    }
  }
  cur.mapPids = pidsList.join(",");
  if (!pidsList.length) {
    hide('places_edit_step_0');
    show('places_edit_step_1');
    hide('places_edit_step_2');
    hide('places_edit_step_3');
    hide('place_map_point');
    return;
  }
  ge('places_edit_step_2').children[1].innerHTML = "”кажите место, где " + langNumeric(pidsList.length, ["", "была сделана %s фотографи€", "были сделаны %s фотографии", "были сделаны %s фотографий"]);
  hide('places_edit_step_0');
  hide('places_edit_step_1');
  show('places_edit_step_2');
  hide('places_edit_step_3');
  show('place_map_point');

  if (cur.placesChooseMap) {
    return;
  }

  var mapChoose = new vkMaps.VKMap('place_map_point_cont', {
    provider: 'google',
    providerId: 2,
    lngcode: cur.vkLngCode,
  });
  cur.placesChooseMap = mapChoose;
  placeholderSetup(ge('place_map_point_search'), {back: true});

  mapChoose.addMapTypeControls();
  mapChoose.addControls({zoom: 'large', pan: false});

  var loc = cur.vkmap.getCenter();
  var point = new vkMaps.LatLonPoint(cur.lastSelectLat || loc.lat, cur.lastSelectLng || loc.lon);
  mapChoose.setCenterAndZoom(point, cur.vkmap.getZoom());
  // Places.setMarker(mapChoose, cur.vkmap.getCenter());

  mapChoose.click.addHandler((function(eventType, map, place) {
    mapChoose.removeMarker(cur.placeMarker);
    Places.setMarker(mapChoose, place.location);
    Places.setPlaceStr(place.location);

      //fadeOut(ge('places_photo_hint_cont'), 200);
  }).bind(this));
};