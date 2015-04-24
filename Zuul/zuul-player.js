/**
 * Game data & functions, related to the main character: player
 */
var player = {
    current: 1,
    maxItems: 3,
    inventory: [],
    lastInput: [],
    newInput: function(line) { this.lastInput = line.match(/\S+/g) || []; main.write(line, true); },
	processCommand: function() {
		this.newInput(main.command.value);
		main.command.value = '';
		main.command.focus();
		var action = player.getVerb();
		if (!action) main.write('I don\'t know that word');
		else main.doAction(action, player.getItem());
	},
	// -1: no word given, undefined: unknown word, >0 valid word
	getVerb: function() { return (this.lastInput.length>0)?main.vocabulary[(this.lastInput[0] || '')]:-1; },
    getItem: function() { return (this.lastInput.length>1)?main.vocabulary[(this.lastInput[1] || '')]:-1; },
    move: function(go) { 
	    var currLoc = this.rooms[this.getLoc()];
	    var newLoc = currLoc.move(go);
	    if (newLoc == -1) return 'No possible exit';
	    else return main.rooms[this.current = newLoc].look();
    },
    getLoc: function() { return this.current; },
    holding: function() { return this.inventory.length; },
    toting: function(i) { return this.inventory.indexOf(i) != -1; },
    do_take: function(i) {
    	// check if an item was specified (-1 if not)
    	if (i == -1) {
	    	// list of items in this room 
	    	var items_here = main.rooms[this.current].getItems();
	    	// check whether there's something we could take
	    	if (!items_here.length) return 'There\'s nothing here to take.';
	    	if (i <= 0) { // no item specified
	    		if (items_here.length == 1) i = items_here[0]; // point to the one item
	    		else return 'Please be more specific.'; // more items here
	    	}
    	}
    	// do we have it already?
    	if (this.toting(i)) return 'You are already carrying it.';
    	// is the item present?
    	if (!main.rooms[this.current].here(i)) return 'No ' + main.items[i].getName() + ' here.';
    	// check whether it is fixed in place
    	if (main.items[i].isFixed()) return 'The ' + main.items[i].getName() + ' cannot be moved.';
    	// carrying the limit?
    	if (this.holding() == this.maxItems) return 'Your bag is full'; 
   		// now we can take ...
		main.rooms[this.current].take(i); 
		this.inventory.push(i); // we push the reffered item
		return main.items[i].getName().toProperCase() + ' taken.';
    },
    do_drop: function() {
    	if (this.holding() === 0) return 'You don\'t carry anything';
    	else {
    		var s = '';
    		for (var i in this.inventory) {
    			//var ref = main.items.indexOf(this.inventory[i]); // get a reference for this item
    			main.rooms[this.current].drop(this.inventory[i]);
    			s += main.items[this.inventory[i]].getName().toProperCase() + ' dropped.\n';
    		}
    		// clear inventory
    		this.inventory = [];
    		return s;
    	}
    },
    do_inventory: function () {
    	var s = (this.inventory.length > 0) ? 'You hold:\n' : 'You don\'t hold anything\n';
        this.inventory.forEach(function (e, i) {
            s += '- ' + main.items[e].show() + '\n';
        });
        return s.slice(0, -1);
    },
    do_look: function () {
    	return main.rooms[this.getLoc()].look();
    },

};


