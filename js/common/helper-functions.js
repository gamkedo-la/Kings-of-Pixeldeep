function pickRandomFromArray(arrayArg) {
    if(!arrayArg || !arrayArg.length) {
        console.error("Cannot pick random element from something that is not an array");
        return;
    }

    let chosenIdx = Math.round(
        Math.random() * (arrayArg.length - 1)
    );

    return arrayArg[chosenIdx];
}

function getRandomBattlefield() {
  const battlefieldNames = ["battlefield1", "battlefield2"];
  const randomIndex = Math.floor(Math.random() * battlefieldNames.length);
  let chosenBattlefield = "battlefield" + randomIndex;
  return chosenBattlefield;
}

// Get query params from the URL (browser's address bar), 
// assign them as key-value pairs to an object of query params
// each param key-value pair is separated by & in the URL
//
// Usage e.g.: http://localhost:8080/?debug=true&param2=value2&param3=value3&....
//      paramsObject: 
//           { debug: true, param2: value2, param3: value3, ... }
function getQueryParamsFromUrl(url) {
    const paramsObject = {};
    url.slice(url.indexOf("?") + 1).split("&").map(param => {
        const [key, value] = param.split("=");
        paramsObject[key] = decodeURIComponent(value);
    })
    return paramsObject;
}

