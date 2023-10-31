//const TOPBAR_WIDTH = canvas.width - MINI_MAP_WIDTH;
const TOPBAR_HEIGHT = 20;
const TOPBAR_TEXT_VERT_OFFSET = 7;

function drawTopbar() {
    // calculated here because canvas.width is undefined at game start
    let topBarWidth = canvas.width - MINI_MAP_WIDTH;

    // background
    canvasContext.drawImage(guiTopBarBackdrop,0,0);

    // TODO: move pause button to left of topbar

    // set the font
    //canvasContext.font = "Bold 15px Serif"; // easier to read
    canvasContext.font = "12px " + CUSTOM_WEBFONT_NAME; 

    // show map state (battle or overworld)
    colorTextShadow((battleMode?"Battle":"World"),45,(TOPBAR_HEIGHT/2)+TOPBAR_TEXT_VERT_OFFSET,'white');

    // show turn number
    colorTextShadow("Turn:"+turnNumber,(topBarWidth/2)-38,(TOPBAR_HEIGHT/2)+TOPBAR_TEXT_VERT_OFFSET,'white');

    // show player gold
    colorTextShadow("Gold:"+(playerGold?playerGold:0),topBarWidth-115,(TOPBAR_HEIGHT/2)+TOPBAR_TEXT_VERT_OFFSET,'white');

}
