const initMap = (lat, lng) => {
  const map = L.map("map", { preferCanvas: true }).setView([lat, lng], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  return map;
};

const createMarker = (
  { macAdress, ssid, authMode, firstSeen, lat, lng, accuracy },
  map,
  markers
) => {
  const fill = authMode === "[OPEN][ESS]" ? "#00ff00" : "#ff00ff";
  const marker = L.circleMarker([lat, lng], {
    fillColor: fill,
    color: fill,
  }).addTo(map);
  marker.bindPopup(
    `MAC: ${macAdress}<br>SSID: ${ssid}<br>Auth Mode: ${authMode}<br>LatLng: ${lat}, ${lng}<br>First Seen: ${firstSeen}<br>Accuracy: ${accuracy}m`
  );
  markers.push(marker);
};

const resetMap = (map, markers) => {
  markers.forEach(marker => map.removeLayer(marker));
};

export { initMap, createMarker, resetMap };
