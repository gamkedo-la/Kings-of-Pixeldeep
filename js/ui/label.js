function labelClass(configObj) {
    this.tag = ""; // attribute to filter array of labels
    this.x = null;
    this.y = null;
    this.text = null;
    this.color = 'transparent';
    this.textColor = 'black';
    this.fontSize = 12;
    this.textAlign = 'center';
    //this.onClick = null;

    this.width = 10;
    this.height = 10;

    this.paddingPx = 10;


    for(const [key, val] of Object.entries(configObj)) {
        if(val) {
            this[key] = val;
        }

        // buttons use 'label', this technically uses text. I'm just making both work.
        if(key === "label") {
            this.text = val;
        }
    }

    if(typeof(this.text) !== "function" && !configObj.width) {
        this.width = this.text.length*this.fontSize + (this.paddingPx * 2);
    }

    this.height = this.fontSize + (this.paddingPx * 2);

    this.draw = function() {

        if(this.color) {
            colorRect(this.x,this.y, this.width, this.height, this.color);
        }

        this.drawLabelText();
    }

    this.drawLabelText = function() {

        let labelText = "";
        if(typeof(this.text) === "function") {
            labelText = this.text();
        } else {
            labelText = this.text;
        }

        // TODO: if text-align is center, labelx needs to be in the middle of the button
        let labelx = this.x + (this.width / 2); // shouldn't need the x2, but apparently I do
        let labely = this.y + this.paddingPx;


        canvasContext.save();
        canvasContext.textBaseline = "top";
        //canvasContext.font = this.fontSize+"pt Serif";
        canvasContext.font = this.fontSize+"px "+CUSTOM_WEBFONT_NAME;

        canvasContext.fillStyle = this.textColor;
        canvasContext.textAlign = this.textAlign;
        canvasContext.fillText(labelText, labelx, labely);
        canvasContext.restore();
    }
}
