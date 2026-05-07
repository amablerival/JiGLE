const filterOpen = ({ authMode }) => authMode === "[OPEN][ESS]";
const filterClosed = ({ authMode }) => authMode !== "[OPEN][ESS]";
const filterWEP = ({ authMode }) => authMode === "[WEP][ESS]";
const filterWPA = ({ authMode }) =>
  authMode === "[WPA-PSK][ESS]" || authMode === "[WPA-WPA2-PSK][ESS]";
const filterWPA2 = ({ authMode }) =>
  authMode === "[WPA2-PSK][ESS]" || authMode === "[WPA2-ENTERPRISE][ESS]";
const filterUnkown = ({ authMode }) => authMode === "[UNKNOWN]";

const resetFilters = (filter, callback) => {
  const filters = [
    filterOpen,
    filterClosed,
    filterWEP,
    filterWPA,
    filterWPA2,
    filterUnkown,
  ];
  const restOfFilters = filters.filter(f => f !== filter);
  for (const filter of restOfFilters) {
    callback(filter);
  }
};

export {
  filterOpen,
  filterClosed,
  filterWEP,
  filterWPA,
  filterWPA2,
  filterUnkown,
  resetFilters,
};
