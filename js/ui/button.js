function buttonClass() {

    this.x = null;
    this.y = null;
    this.label = null;
    this.color = '#ff00ff';
    this.onClick = null;

    this.paddingPx = 3;

    this.create = function(btnX,btnY,  btnLabel, btnColor, clickFunc) {
	this.x = btnX;
	this.y = btnY;
	this.label = btnLabel;
	this.color = btnColor;
	this.onClick = clickFunc;
    }

    this.draw = function() {
	// TODO: make button images for prettier buttons
	let buttonWidth = this.label.length*10 + (this.paddingPx * 2);
	let buttonHeight = 12 + (this.paddingPx * 2);

	colorRect(this.x,this.y, buttonWidth,buttonHeight, this.color);

	colorText(this.label, this.x+paddingPx,this.y+paddingPx, 'black');
    }
}
