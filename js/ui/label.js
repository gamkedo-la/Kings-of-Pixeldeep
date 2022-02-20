function labelClass(configObj) {

    this.x = null;
    this.y = null;
    this.text = null;
    this.color = null;
    this.textColor = 'black';
    this.fontSize = 12;
    //this.onClick = null;

    this.width = 10;
    this.height = 10;

    this.paddingPx = 10;


    for(const [key, val] of Object.entries(configObj)) {
        if(val) {
            this[key] = val;
        }
    }

    if(typeof(this.text) !== "function") {
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
        canvasContext.font = this.fontSize+"pt Serif";
        canvasContext.fillStyle = this.textColor;
        canvasContext.textAlign = "center";
        canvasContext.fillText(labelText, labelx, labely);
        canvasContext.restore();
    }
}
