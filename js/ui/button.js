function buttonClass() {

    this.x = null;
    this.y = null;
    this.label = null;
    this.color = '#ff00ff';
    this.textColor = '#00ff00';
    this.fontSize = 12;
    this.onClick = null;

    this.width = 10;
    this.height = 10;

    this.paddingPx = 3;

    this.create = function(configObj) {
	// TODO: give these default values when not specified
	for(const [key, val] of Object.entries(configObj)) {
	    if(val) {
		this[key] = val;
	    }
	}
	    /*
	this.x = configObj.x;
	this.y = configObj.y;
	this.label = configObj.label;
	this.color = configObj.color;
	this.textColor = configObj.textColor;
	this.onClick = configObj.onClick;
	this.fontSize = configObj.fontSize;
	*/
	// also this would be a good place to set up pre-computed values
	// since it only runs once and not every frame
	// like `this.x = parentX + relativeX;`
	console.log("paddingPx", this.paddingPx);
	this.width = this.label.length*this.fontSize + (this.paddingPx * 2);
	this.height = this.fontSize + (this.paddingPx * 2);
    }

    this.draw = function() {
	// TODO: make button images for prettier buttons

	colorRect(this.x,this.y, this.width, this.height, this.color);

	this.drawButtonLabel();
	/*
	colorText(this.label, 
	    this.x+this.paddingPx,
	    this.y+this.fontSize+this.paddingPx, this.textColor);
	*/
    }

    this.drawButtonLabel = function() {
	// TODO: if text-align is center, labelx needs to be in the middle of the button
	let labelx = this.x + this.paddingPx;
	let labely = this.y + this.paddingPx;

	canvasContext.save();
	canvasContext.textBaseline = "top";
	canvasContext.font = this.fontSize+"pt Serif";
	canvasContext.fillStyle = this.textColor;
	canvasContext.textAlign = "left";
	canvasContext.fillText(this.label, labelx, labely);
	canvasContext.restore();
    }
}

function testButton() {
    console.log("Button pressed");
}
