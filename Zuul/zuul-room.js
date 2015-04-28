/**
 * Room class, defines properties and methods for a room/location in the game
 * Room 0 is considered to be death (compares to 0 are sometimes not as expected ...)
 */
function Room(name) {
    this.name = name;
    this.exits = [];
    this.items = [];
}
Room.prototype = {
	constructor: Room,
	addExit: function(exit) { this.exits.push(exit); },
	getItems: function() { return this.items; },
	drop: function(i) { this.items.push(i); },
	take: function(i) { return this.items.splice(this.items.indexOf(i), 1); },
	here: function(i) { return this.items.indexOf(i) != -1; },
	move: function(d) {
		for (var e in this.exits) {
			if (this.exits[e].command == d) {
				var check = this.exits[e].checkCondition();
				if (check > 0) return this.exits[e].target;
				else return check;
			}
		}
		return -1;
	},
	look: function() {
		var s = this.name + '\n';
		this.items.forEach(function (e, i) { s += e.look() + '\n'; });
		s += 'Valid exits: ';
		this.exits.forEach(function (e, i) { s += e.command + ', '; });
		return s.slice(0, -2);
	}
};