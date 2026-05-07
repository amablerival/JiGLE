const initMap = (lat, lng) => {
  const map = L.map("map", { preferCanvas: true }).setView([lat, lng], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  return map;
};

const colorFiller = key => {
  switch (key) {
    case "[WPA2-ENTERPRISE][ESS]":
    case "[WPA2-PSK][ESS]":
      return "#b8010f";
      break;
    case "[WPA-WPA2-PSK][ESS]":
    case "[WPA-PSK][ESS]":
      return "#b8ac01";
      break;
    case "[WEP][ESS]":
      return "#a901b8";
      break;
    case "[OPEN][ESS]":
      return "#00ff5e";
      break;
    case "[UNKNOWN]":
    default:
      return "#016cb8";
      break;
  }
};

const createMarker = (
  { macAdress, ssid, authMode, firstSeen, rssi, lat, lng, accuracy },
  map,
  markers
) => {
  const fill = authMode === "[OPEN][ESS]" ? "rgb(0, 255, 94)" : "#b8010f";
  const marker = L.circleMarker([lat, lng], {
    color: colorFiller(authMode),
    // fillColor: fill,
    opacity: Math.log(100 / Math.abs(rssi)) * 100 + 0.5,
    radius: Math.abs(Math.log(100 / Math.abs(rssi))) * 440,
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
