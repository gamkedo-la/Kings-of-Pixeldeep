function buttonClass() {

    this.x = null;
    this.y = null;
    this.label = null;
    this.color = '#ff00ff';
    this.textColor = '#00ff00';
    this.onClick = null;

    this.paddingPx = 3;

    this.create = function(configObj) {
	// TODO: give these default values when not specified
	this.x = configObj.x;
	this.y = configObj.y;
	this.label = configObj.label;
	this.color = configObj.color;
	this.textColor = configObj.textColor;
	this.onClick = configObj.onClick;
	// also this would be a good place to set up pre-computed values
	// since it only runs once and not every frame
	// like `this.x = parentX + relativeX;`
    }

    this.draw = function() {
	// TODO: make button images for prettier buttons
	let buttonWidth = this.label.length*10 + (this.paddingPx * 2);
	let buttonHeight = 12 + (this.paddingPx * 2);

	colorRect(this.x,this.y, buttonWidth,buttonHeight, this.color);

	colorText(this.label, 
	    this.x+(buttonHeight),
	    this.y+this.paddingPx, 'black');
    }
}

function testButton() {
    console.log("Button pressed");
}
