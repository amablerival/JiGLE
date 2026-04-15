import fileInputManager from "./modules/file-manager.js";
import { createMarker, initMap, resetMap } from "./modules/map-manager.js";

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
 * GEOLOCATION
 *
 */
// Geolocation and map initialization
navigator.geolocation.getCurrentPosition(
  ({ coords: { latitude, longitude } }) => {
    console.log("Geolocation: ", latitude, longitude);
    map = initMap(latitude, longitude); // map needs to be initialized after geolocation is obtained
  },
  error => console.error(error)
);

/**
 *
 * UI
 *
 */

const setMarkers = locations => {
  locations.forEach(position => {
    createMarker(position, map, markers);
  });
};

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

const filterOpen = loc => loc.authMode === "[OPEN][ESS]";
const filterClosed = loc => loc.authMode !== "[OPEN][ESS]";
const regexFilter = regex => loc => regex.test(loc.ssid) || regex.test(loc.macAdress);
const removeFilter = filter => {
  const hasFilter = filters.find(filter);
  if (hasFilter === -1) return;
  filters.splice(filters.indexOf(hasFilter), 1);
};

const filterCallback = event => {
  const value = event.target.value;
  if (value === "open") {
    removeFilter(filterClosed);
    filters.push(filterOpen);
  } else if (value === "closed") {
    removeFilter(filterOpen);
    filters.push(filterClosed);
  } else if (value === "all")
    filters.length = 0; // Clear filters
  else if (value.trim() !== "") {
    const regex = new RegExp(value, iFlag.checked ? "i" : gFlag.checked ? "g" : "");
    console.log(regex);
    removeFilter(regexFilter(regex));
    filters.push(regexFilter(regex));
  } else filters.length = 0; // Clear filters if input is empty

  const combined = combineFilters(...filters);
  const filteredLocations = locations.filter(combined);
  console.log(filters);

  resetMap(map, markers);
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
const iFlag = document.getElementById("i");
const gFlag = document.getElementById("g");

const clearButton = document.getElementById("reset");
clearButton.addEventListener("click", () => {
  filters.length = 0; // Clear filters
  filterSelect.value = "all"; // Reset select
  pattern.value = ""; // Clear regex input
  iFlag.checked = false; // Uncheck i flag
  gFlag.checked = false; // Uncheck g flag

  resetMap(map, markers); // Clear map
  setMarkers(locations); // Reset markers
  setFileInfo(locations.length, locations.length); // Reset file info
});
