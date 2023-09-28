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
