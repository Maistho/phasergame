require(['lib/phaser', 'module/Gem'], function(Phaser, Gem) {
var _game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});

function preload() {
	game.load.script('gray', 'filters/Gray.js');

};

function create() {
	grayFilter = game.add.filter('Gray');
	grayFilter.gray = 0.7;
	spawnBoard();
	game.input.onUp.add(onRelease);



	bmd = game.add.bitmapData(800,600);
	var color = 'white';

	bmd.ctx.beginPath();
	bmd.ctx.lineWidth = "4";
	bmd.ctx.strokeStyle = color;
	bmd.ctx.stroke();
	sprite = game.add.sprite(0, 0, bmd);
};

function update() {
	if(draggedGems) {
		bmd.clear();
		for(var i = 1; i < draggedGems.length; ++i) {
			drawLine(draggedGems[i-1], draggedGems[i], 3);
		}
		drawLine(draggedGems[draggedGems.length-1], game.input.position, 1);

	}
};

function render() {
	game.debug.pointer(game.input.mousePointer);
};

});
