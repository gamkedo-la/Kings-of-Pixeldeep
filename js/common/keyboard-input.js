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

}

function keyReleased(evt) {
	// console.log("released " + evt.keyCode);

	if( evt.keyCode === 66 ) { // key: b
		setupBattleMode();
	}

	if(evt.keyCode === 87 ) { // key: w
		setupWorldMode();
	}

	if(evt.keyCode === 69 ) { // key: e
        if(battleMode) {
            setupEditorMode('battle');
        } else {
            setupEditorMode('world');
        }
	}
}
