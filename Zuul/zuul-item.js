/**
 * Item class, properties and methods of various items present in the game
 * Item 0 is not used
 */
function Item(name, description) {
	this.name = name;
	this.status = 0;
	this.message = [description];
	this.fixed = false;
}
Item.prototype = {
	constructor: Item,
	getName: function() { return this.name; },
	addStatus: function(m) { this.message.push(m); },
	setStatus: function(s) { this.status = s; },
	getStatus: function() { return this.status; },
	show: function() { return this.message[this.status]; },
	look: function() { return 'There is ' + this.show() + ' here.'; },
	isFixed: function() { return this.fixed; },
	setFixed: function() {  this.fixed = true; }
};