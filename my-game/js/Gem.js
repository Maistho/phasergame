define(function() {

	var _game = null;
	var _sprite = null;
	var _color = null;

	return {
		init: function(game) {
			_game = game;
		},
		preload: function() {
			for(var i = 0; i < COLORS.length; ++i) {
				_game.load.image(COLORS[i] + "_gem", "img/" + COLORS[i] + ".png");
			}

		},
		create: function() {

		},
		update: function() {

		}
	};
});
var Gem = (function(group, posX, posY, color) {
	this.sprite = group.create(posX * GEM_SIZE_SPACED, posY * GEM_SIZE_SPACED, color);
	this.color = color;
	this.setPos(posX,posY);
	this.sprite.inputEnabled = true;
	this.sprite.events.onInputDown.add(this.pressed);
	this.sprite.events.onInputOver.add(this.over);
});

Gem.prototype = {
	setPos: function (x,y) {
		this.x = x;
		this.y = y;
		this.updateID();
	},
	updateID: function () {
		this.id = this.x + this.y * BOARD_COLS;
	},
	pressed: function (sprite, pointer) {
		draggedGems = [this];
		draggingColor = this.color;
		gems.forEach(function(item) {
			if (item.color != this.color) {
				item.filters = [grayFilter];
			}
		});
	},
	over: function (sprite, pointer) {
		if (this.color == draggingColor) {
			if (draggedGems) {
				for (var i = 0; i < draggedGems.length; ++i) {
					if( draggedGems[i] === this) {
						return;
					}
				}
				draggedGems.push(this);
			}
		}
	}

};
