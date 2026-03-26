import fileInputManager from "./modules/file-manager.js";
import { initMap } from "./modules/map-manager.js";

const fileInput = document.getElementById("csvFileInput");
const markers = [];
const filters = [];
let locations, map;

/**
 *
 * FILE INPUT
 *
 */
// Callback for file input processing
const locationsCallback = loc => {
  locations = loc;
  setMarkers(locations);
  setFileInfo(locations.length, locations.length);
};
// File input handling
fileInput.addEventListener("change", e => {
  fileInputManager(e, locationsCallback);
});

/**
 *
 * MAP & MARKERS
 *
 */
// Geolocation and map initialization
const successCallback = position => {
  const {
    coords: { latitude, longitude },
  } = position;
  console.log(position);
  map = initMap(latitude, longitude);
};
const errorCallback = error => console.error(error);
navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
  timeout: 10000,
});

const createMarker = ({
  macAdress,
  ssid,
  authMode,
  firstSeen,
  lat,
  lng,
  accuracy,
}) => {
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

const setMarkers = locations => {
  locations.forEach(position => {
    createMarker(position);
  });
};

const resetMap = () => {
  markers.forEach(marker => map.removeLayer(marker));
};

/**
 *
 * UI
 *
 */

const fileInfo = document.getElementById("file-info");
const setFileInfo = (filtered, total) => {
  fileInfo.textContent =
    filtered !== total
      ? `Showing ${filtered} of ${total} networks`
      : `Showing all ${total} networks`;
};

/**
 * FILTERS
 *
 */

// const filterCallback = (event) => {
//   const value = event.target.value;
//   let filteredLocations = [];
//   switch (true) {
//     case value === "open":
//       filteredLocations = locations.filter(
//         (loc) => loc.authMode === "[OPEN][ESS]"
//       );
//       break;
//     case value === "closed":
//       filteredLocations = locations.filter(
//         (loc) => loc.authMode !== "[OPEN][ESS]"
//       );
//       break;
//     case value === "all":
//       filteredLocations = locations;
//       break;
//     case value.trim() !== "":
//       const regex = new RegExp(value, "i");
//       filteredLocations = locations.filter(
//         (loc) => regex.test(loc.ssid) || regex.test(loc.macAdress)
//       );
//       break;
//     default:
//       filteredLocations = locations;
//       break;
//   }
//   resetMap();
//   setMarkers(filteredLocations);
//   setFileInfo(filteredLocations.length, locations.length);
// };
const filterCallback = event => {
  const value = event.target.value;

  if (value === "open") filters.push(loc => loc.authMode === "[OPEN][ESS]");
  else if (value === "closed")
    filters.push(loc => loc.authMode !== "[OPEN][ESS]");
  else if (value === "all")
    filters.length = 0; // Clear filters
  else if (value.trim() !== "") {
    const regex = new RegExp(value, "i");
    filters.push(loc => regex.test(loc.ssid) || regex.test(loc.macAdress));
  } else filters.length = 0; // Clear filters if input is empty

  const combined = combineFilters(...filters);
  const filteredLocations = locations.filter(combined);

  resetMap();
  setMarkers(filteredLocations);
  setFileInfo(filteredLocations.length, locations.length);
};
const combineFilters =
  (...filters) =>
  item =>
    filters.map(filter => filter(item)).every(x => x === true);

const filterSelect = document.getElementById("networks");
filterSelect.addEventListener("change", filterCallback);
const pattern = document.getElementById("pattern");
pattern.addEventListener("input", filterCallback);
