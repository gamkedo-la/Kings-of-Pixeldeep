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
    var mousePos = calculateMousePos(evt);

    if(isClickOnButton(mousePos, button1)) {
	console.log("click is on the button");
	button1.onClick();
    }
}

function isClickOnButton(mousePos, button) {
    if(mousePos.x < button.x + button.width) {
        return false;
    }
    if(mousePos.x > button.x) {
        return false;
    }
    if(mousePos.y < button.y) {
        return false;
    }
    if(mousePos.y > button.y + button.height) {
        return false;
    }

    return true;

}
