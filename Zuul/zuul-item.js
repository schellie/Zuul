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
	this.ability = [];
	this.props = [];
}
Item.prototype = {
	constructor: Item,
	getName: function() { return this.name; },
	addStatus: function(m) { this.message.push(m); },
	setStatus: function(s) { if (s >= 0 && s < this.message.length) this.status = s; },
	getStatus: function() { return this.status; },
	incrStatus: function() { if (this.status < this.message.length - 1) this.status++; },
	decrStatus: function() { if (this.status > 0) this.status--; },
	changeStatus: function(p) { 
		var s = this.props[p];
		if (parseInt(s) >= 0) this.setStatus(s);
		else if (s == '-') this.decrStatus();
		else if (s == '+') this.incrStatus();
	},
	addProp: function(p, v) { this.props[p] = v; },
	hasProp: function(p) { return this.props[p] !== undefined; },
	getProps: function() { return this.props; },
	checkProp: function(p, list) {
		for (var i in list) {
			if (list[i].hasAbility(p)) { this.changeStatus(p); return true; }
		}
		return false;
	},
	addAbility: function(a) { this.ability.push(a); },
	hasAbility: function(a) { return this.ability.indexOf(a) != -1; },
	getAbilities: function() { return this.ability; },
	show: function() { return this.message[this.status]; },
	look: function() { return 'There is ' + this.show() + ' here.'; },
	setFixed: function() { this.fixed = true; },
	isFixed: function() { return this.fixed; }
};
