var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});

var GEM_SIZE = 48,
	 GEM_SPACING = 2,
	 GEM_SIZE_SPACED = GEM_SIZE + GEM_SPACING,
	 MATCHES_REQUIRED = 3,
	 BOARD_COLS,
	 BOARD_ROWS;

var COLORS = ["red", "purple", "blue", "green", "yellow"];

var gems,
	 grayFilter,
	 draggingColor,
	 draggedGems;


function preload() {
	for(var i = 0; i < COLORS.length; ++i) {
		game.load.image(COLORS[i] + "_gem", "img/" + COLORS[i] + ".png");
	}
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

function spawnBoard() {
	BOARD_COLS = Phaser.Math.floor(game.world.width / GEM_SIZE_SPACED);
	BOARD_ROWS = Phaser.Math.floor(game.world.height / GEM_SIZE_SPACED);
	gems = game.add.group();
	for (var i = 0; i < BOARD_COLS; i++) {
		for (var j = 0; j < BOARD_ROWS; j++) {
			var color = randomColor();
			var gem = gems.create(i * GEM_SIZE_SPACED, j * GEM_SIZE_SPACED, color);
			gem.color = color;
			gem.posX = i;
			gem.posY = j;
			gem.inputEnabled = true;
			gem.events.onInputDown.add(pressedGem);
			gem.events.onInputOver.add(overGem);
		}
	}
};

function overGem(gem, pointer) {
	if (gem.color == draggingColor) {
		if (draggedGems) {
			for (var i = 0; i < draggedGems.length; ++i) {
				if( draggedGems[i] === gem) {
					return;
				}
			}
			draggedGems.push(gem);
		}
	}
};

function pressedGem(gem, pointer) {
	draggedGems = [gem];
	draggingColor = gem.color;
	gems.forEach(function(item) {
		if (item.color != gem.color) {
			item.filters = [grayFilter];
		}
	});
};

function onRelease() {
	draggingColor = null;
	gems.forEach(function(item) {
		item.filters = null;
	});

	if (draggedGems && draggedGems.length >= MATCHES_REQUIRED) {
		for(var i = 0; i < draggedGems.length; ++i) {
			draggedGems[i].destroy();
		}
	}
	draggedGems = null;
	bmd.clear();
	dropGems();
};

function randomColor() {
	return COLORS[game.rnd.integerInRange(0, COLORS.length -1)] + "_gem";
};

function drawLine(pos1, pos2, isGems) {
	var newPos1, newPos2;
	if (isGems == 1 || isGems == 3) {
		newPos1 = {
			x: (pos1.x + (GEM_SIZE/2)),
			y: (pos1.y + (GEM_SIZE/2))
		};
	} else {
		newPos1 = {
			x: pos1.x,
			y: pos1.y
		};
	}
	if (isGems == 2 || isGems == 3) {
		newPos2 = {
			x: (pos2.x + (GEM_SIZE/2)),
			y: (pos2.y + (GEM_SIZE/2))
		};
	} else {
		newPos2 = {
			x: pos2.x,
			y: pos2.y
		};
	}
	bmd.ctx.beginPath();
	bmd.ctx.beginPath();
	bmd.ctx.moveTo(newPos1.x, newPos1.y);
	bmd.ctx.lineTo(newPos2.x, newPos2.y);
	bmd.ctx.lineWidth = 4;
	bmd.ctx.stroke();
	bmd.ctx.closePath();
	bmd.render();
};


function dropGems() {
	var dropRowCountMax = 0;
	for (var i = 0; i < BOARD_COLS; ++i) {
		var dropRowCount = 0;
		for (var j = BOARD_ROWS - 1; j >= 0; --j) {
			var gem = getGem(i,j);
			if (gem == null) {
				dropRowCount++;
			} else {
				setGemPos(gem, gem.posX, gem.posY + dropRowCount);
				tweenGemPos(gem, gem.posX, gem.posY, dropRowCount);
			}
		}
		dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
	}
};


function setGemPos(gem, posX, posY) {
	gem.posX = posX;
	gem.posY = posY;
};

function getGem(x,y) {
	var ret_gem = null;
	gems.forEach(function(gem) {
		if(gem.posX == x && gem.posY == y)
		ret_gem = gem;
	});
	return ret_gem;
};
// animated gem movement
function tweenGemPos(gem, newPosX, newPosY, durationMultiplier) {
	if (durationMultiplier == null) {
		durationMultiplier = 1;
	}
	return game.add.tween(gem).to({x: newPosX  * GEM_SIZE_SPACED, y: newPosY * GEM_SIZE_SPACED}, 300 * durationMultiplier, Phaser.Easing.Bounce.Out, true);
}
