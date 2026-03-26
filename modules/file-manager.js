const fileInputManager = (event, onLoad) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  let locs = [];
  reader.onload = (e) => {
    const csvText = e.target.result;
    const lines = csvText.trim().split(/[\r\n]+/);
    const headers = lines[0].split(",");
    const data = lines.slice(1).map((line) => {
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

const filterLocations = (data) =>
  data
    .slice()
    .filter((f) => f["WigleWifi-1.4"] !== "" && f["WigleWifi-1.4"] !== "MAC")
    .map((m) => ({
      macAdress: m["WigleWifi-1.4"],
      ssid: m["appRelease=v1.5.2"],
      authMode: m["model=Cardputer"],
      firstSeen: m["release=v1.5.2"],
      lat: +m["board=M5Cardputer"],
      lng: +m["brand=M5Stack"],
      accuracy: +m["Unnamed: 9"],
    }));

export default fileInputManager;
