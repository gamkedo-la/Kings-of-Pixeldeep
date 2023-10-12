const BUTTON_CLASS_COLOR_FAINT_WHITE = 'rgba(255,255,255,0.3)';

function buttonClass(configObj) {

    this.x = null;
    this.y = null;
    this.label = null;
    this.color = BUTTON_CLASS_COLOR_FAINT_WHITE;
    this.textColor = 'black';
    this.fontSize = 15;
    this.font = "Bold 15px Serif";
    this.onClick = null;
    this.hoverSoundPlayed = false;

    // these values are hardcoded to fit the background image
    // defaults are for BIG buttons (world move mode etc)
    this.width = 150;
    this.height = 50;
    this.paddingPx = 20;

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

    // FIXME: width and height assume all glyphs are square and monospaced
    // instead of dynamic sized buttons, we now use hardcoded sizes + image
    /*
    if(typeof(this.label) !== "function") {
        this.width = this.label.length*this.fontSize + (this.paddingPx * 2);
    }
    this.height = this.fontSize + (this.paddingPx * 2);
    */

    this.draw = function() {
        // TODO: make button images for prettier buttons

        let newColor = "";
        if(typeof(this.color) === "function") {
            newColor = this.color();
        } else {
            newColor = this.color;
        }

        colorRect(this.x,this.y, this.width, this.height, newColor);

        if(this.highlightIf()) {
            colorRect(this.x+3,this.y+3, this.width-6,this.height-6, "cyan");
            if(this.hoverSoundPlayed == false){
                this.hoverSoundPlayed = true;
                buttonHoverSound.play();
            }
            
        } else{
            this.hoverSoundPlayed = false;
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

        let newTextColor = "";
        if(typeof(this.textColor) === "function") {
            newTextColor = this.textColor();
        } else {
            newTextColor = this.textColor;
        }

        canvasContext.save();
        canvasContext.textBaseline = "top";
        canvasContext.font = this.font;
        canvasContext.fillStyle = newTextColor;
        canvasContext.textAlign = "center";
        canvasContext.fillText(labelText, labelx, labely);
        canvasContext.restore();
    }
}

function testButton() {
    console.log("Button pressed");
    buttonClickSound.play();
}
