function dialogBoxClass(configObj) {

    this.x = null;
    this.y = null;
    this.title = null;
    this.bodyText = null;
    this.color = 'grey';
    //this.textColor = 'black';
    //this.fontSize = 12;
    this.buttons = [];

    this.width = 100;
    this.height = 100;

    this.paddingPx = 10;

    // TODO: give these default values when not specified
    for(const [key, val] of Object.entries(configObj)) {
        if(val) {
            this[key] = val;
        }
    }

    this.width = this.label.length*this.fontSize + (this.paddingPx * 2);
    this.height = this.fontSize + (this.paddingPx * 2);

    this.draw = function() {
        // TODO: make button images for prettier buttons

        colorRect(this.x,this.y, this.width, this.height, this.color);

        this.drawDialogTitle();
        this.drawDialogBodyText();
        this.drawDialogButtons();
    }

    this.drawDialogTitle = function() {
        // see button.js for example to pull from
    }

    this.drawDialogBodyText = function() {
        // see button.js for example to pull from
    }
    this.drawDialogButtons = function() {
        for(var i=0;i<this.buttons.length;i++) {
            this.buttons[i].draw();
        }
    }
}
