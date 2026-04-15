const fileInputManager = (event, onLoad) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  let locs = [];
  reader.onload = e => {
    const csvText = e.target.result;
    const lines = csvText.trim().split(/[\r\n]+/);
    const headers = lines[0].split(",");
    const data = lines.slice(1).map(line => {
      const values = line.split(",");
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i] || "";
        return obj;
      }, {});
    });
    locs = filterLocations(data);
  };

  reader.readAsText(file);

  reader.onloadend = () => onLoad(locs);
};

const filterLocations = data =>
  data.slice().map(m => ({
    macAdress: m["MAC"],
    ssid: m["SSID"],
    authMode: m["AuthMode"],
    firstSeen: m["FirstSeen"],
    lat: +m["CurrentLatitude"],
    lng: +m["CurrentLongitude"],
    accuracy: +m["AccuracyMeters"],
  }));

export default fileInputManager;
