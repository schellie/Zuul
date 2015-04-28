/**
 * Item class, properties and methods of various items present in the game
 * Item 0 is not used
 */
function Item(name) {
	this.name = name;
	this.status = 0;
	this.message = [];
	this.fixed = false;
	// other properties for item
	this.props = [];
}
Item.prototype = {
	constructor: Item,
	getName: function() { return this.name; },
	addStatus: function(m) { this.message.push(m); },
	setStatus: function(s) { this.status = s; },
	getStatus: function() { return this.status; },
	incrStatus: function() { this.status++; },
	decrStatus: function() { this.status--; },
	addProp: function(p) { this.props.push(p); },
	getProp: function(p) { return this.props.indexOf(p) >= 0; },
	show: function() { return this.message[this.status]; },
	look: function() { return 'There is ' + this.show() + ' here.'; },
	setFixed: function() { this.fixed = true; },
	isFixed: function() { return this.fixed; },
	isLockable: function() { return this.lock; },
	hasLight: function() { return this.light; }
};
