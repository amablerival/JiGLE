const initMap = (lat, lng) => {
  const map = L.map("map", { preferCanvas: true }).setView([lat, lng], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  return map;
};

export { initMap };
