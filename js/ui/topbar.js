//const TOPBAR_WIDTH = canvas.width - MINI_MAP_WIDTH;
const TOPBAR_HEIGHT = 20;
const TOPBAR_TEXT_VERT_OFFSET = 5;

function drawTopbar() {
    // calculated here because canvas.width is undefined at game start
    let topBarWidth = canvas.width - MINI_MAP_WIDTH;

    // background
    colorRect(0, 0, 
        topBarWidth, TOPBAR_HEIGHT, 
        'grey');

    // TODO: move pause button to left of topbar

    // show turn number
    colorText("Turn: "+turnNumber, 
        (topBarWidth / 2) - 15, (TOPBAR_HEIGHT / 2) + TOPBAR_TEXT_VERT_OFFSET,
        'black');

    if(playerGold) {
        // show player gold
        colorText("Gold: "+playerGold, 
            topBarWidth - 100, (TOPBAR_HEIGHT / 2) + TOPBAR_TEXT_VERT_OFFSET,
            'black');
    }
}
