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
  { macAdress, ssid, authMode, firstSeen, rssi, lat, lng, accuracy },
  map,
  markers
) => {
  const fill = authMode === "[OPEN][ESS]" ? "rgb(0, 255, 94)" : "#b8010f";
  const marker = L.circleMarker([lat, lng], {
    color: fill,
    fillColor: fill,
    opacity: Math.log(100 / Math.abs(rssi)) * 100 + 0.5,
    radius: Math.log(100 / Math.abs(rssi)) * 100 + 1,
  }).addTo(map);
  marker.bindPopup(
    `MAC: ${macAdress}<br>SSID: ${ssid}<br>Auth Mode: ${authMode}<br>LatLng: ${lat}, ${lng}<br>First Seen: ${firstSeen}<br>RSSI: ${rssi}dBm`
  );
  markers.push(marker);
};

const resetMap = (map, markers) => {
  markers.forEach(marker => map.removeLayer(marker));
};

export { initMap, createMarker, resetMap };
