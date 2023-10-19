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
}

function keyReleased(evt) {
	// console.log("released " + evt.keyCode);

	if (evt.keyCode === 66) { // key: b
		requestBattleMode();
	}

	if (evt.keyCode === 87) { // key: w
		requestWorldMode();
	}

	if (evt.keyCode === 69) { // key: e
		requestEditorMode();
	}

	if (evt.keyCode === 80) { // key: p
		togglePauseMode();
	}

	if (evt.keyCode === 77) { // key: m
		toggleAudioMute();
	}

	if (evt.keyCode === 68) { // key: d
		gameOptions.showDebug = !gameOptions.showDebug;
	}

	if (evt.keyCode === 71) { // key: g
		gameOptions.showGrid = !gameOptions.showGrid;
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

	//toggleUserInteractStage();
}
