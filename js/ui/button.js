function buttonClass(configObj) {

    this.x = null;
    this.y = null;
    this.label = null;
    this.color = '#d3d3d3';
    this.textColor = 'black';
    this.fontSize = 12;
    this.onClick = null;

    this.width = 10;
    this.height = 10;

    this.paddingPx = 10;

    // set buttons to never highlight by default since
    // most buttons won't use this functionality
    this.highlightIf = function() {
        return false;
    }

    // TODO: give these default values when not specified
    for(const [key, val] of Object.entries(configObj)) {
        if(val || val === 0) {
            this[key] = val;
        }
    }
    // also this would be a good place to set up pre-computed values
    // since it only runs once and not every frame
    // like `this.x = parentX + relativeX;`
    //console.log("paddingPx", this.paddingPx);
    if(typeof(this.label) !== "function") {
        this.width = this.label.length*this.fontSize + (this.paddingPx * 2);
    }
    this.height = this.fontSize + (this.paddingPx * 2);

    this.draw = function() {
        // TODO: make button images for prettier buttons

        colorRect(this.x,this.y, this.width, this.height, this.color);

        if(this.highlightIf()) {
            colorRect(this.x+3,this.y+3, this.width-6,this.height-6, "cyan");
        }

        this.drawButtonLabel();
        /*
        colorText(this.label, 
            this.x+this.paddingPx,
            this.y+this.fontSize+this.paddingPx, this.textColor);
        */
    }

    this.drawButtonLabel = function() {

        let labelText = "";
        if(typeof(this.label) === "function") {
            labelText = this.label();
        } else {
            labelText = this.label;
        }

        // TODO: if text-align is center, labelx needs to be in the middle of the button
        let labelx = this.x + (this.width / 2); // shouldn't need the x2, but apparently I do
        let labely = this.y + this.paddingPx;


        canvasContext.save();
        canvasContext.textBaseline = "top";
        canvasContext.font = this.fontSize+"pt Serif";
        canvasContext.fillStyle = this.textColor;
        canvasContext.textAlign = "center";
        canvasContext.fillText(labelText, labelx, labely);
        canvasContext.restore();
    }
}

function testButton() {
    console.log("Button pressed");
}
