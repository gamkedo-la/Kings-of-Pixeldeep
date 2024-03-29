var debugKeys = false;

function setupKeyboardInput() {

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
}

function keyPressed(evt) {
	//console.log("pressed " + evt.keyCode);

	// key codes:
	// e: 69 (editor)
	// b: 66 (battle)
	// w: 87 (world)
	// d: 68 (debug)
	// g: 71 (grid)

	//toggleUserInteractStage();
    
    if (evt.key == "Tab") {
        evt.preventDefault();
    }

}

function keyReleased(evt) {
	// console.log("released " + evt.keyCode);

    if(debugKeys) {
        if (evt.keyCode === 66) { // key: b
            requestBattleMode();
        }

        if (evt.keyCode === 87) { // key: w
            requestWorldMode();
        }

        if (evt.keyCode === 69) { // key: e
            requestEditorMode();
        }

        if (evt.keyCode === 68) { // key: d
            gameOptions.showDebug = !gameOptions.showDebug;
        }

    }

	if (evt.keyCode === 80) { // key: p
		togglePauseMode();
	}

	if (evt.keyCode === 77) { // key: m
		toggleAudioMute();
	}

	if (evt.keyCode === 71) { // key: g
		gameOptions.showGrid = !gameOptions.showGrid;
	}

    if (evt.key == "h") {
        const div = document.getElementById("helpwindow");

        if (div) {
            if (div.style.display == "block") {
                div.style.display = "none";
            }
            else if (div.style.display == "none") {
                div.style.display = "block";
            }
            else {
                div.style.display = "block";
            }
        }
    }

    if (evt.key == "Escape") {
        if(battleMode && !editorMode) { 
            selectedUnits = [];
        }
        if(!battleMode && !editorMode) {
            if(selectedWorldEntity) {
                deselectWorldEntity();
            }
        }
    }

    if (evt.key == "Tab") {
        if(!battleMode && !editorMode) {
            selectNextAvailableArmy();
        }
    }

	//toggleUserInteractStage();
}

