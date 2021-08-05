const SIDEBAR_WIDTH = 200;

var button1 = new buttonClass();
  button1.create({
    x:700,
    y:300, 
    label: "Test", 
    color:"blue", 
    textColor: "yellow",
    onClick: testButton,
  });

const SIDEBAR_BUTTONS = [
    button1,
]

function drawSidebar() {
    colorRect(canvas.width-SIDEBAR_WIDTH,MINI_MAP_HEIGHT, 
	SIDEBAR_WIDTH,canvas.height, 'grey');

    for(const button of SIDEBAR_BUTTONS) {
	button.draw();
    }
}

function handleSidebarButtonClick(evt) {
    console.log("in handleSidebarButtonClick");
    var mousePos = calculateMousePos(evt);

    if(isClickOnButton(mousePos, button1)) {
	console.log("click is on the button");
	button1.onClick();
    }
}

function isClickOnButton(mousePos, button) {
    if(mousePos.x < button.x) {
	//console.log("click is left of button");
        return false;
    }
    if(mousePos.x > button.x + button.width) {
	//console.log("click is right of button");
        return false;
    }
    if(mousePos.y < button.y) {
	//console.log("click is above button");
        return false;
    }
    if(mousePos.y > button.y + button.height) {
	//console.log("click is below button");
        return false;
    }

    return true;

}
