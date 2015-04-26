/**
 * Game data & functions, related to the main character: player
 */
var player = {
    currentRoom: 1,
    maxItems: 3,
    inventory: [],
    lastInput: [],
    newInput: function(line) { this.lastInput = line.match(/\S+/g) || []; main.write(line, true); },
	processCommand: function() {
		this.newInput(main.command.value);
		main.command.value = '';
		main.command.focus();
		main.doAction(player.getVerb(), player.getItem());
	},
	// -1: no word given, undefined: unknown word, >0 valid word
	getVerb: function() { return (this.lastInput.length>0)?(main.vocabulary[this.lastInput[0]] || -1):0; },
    getItem: function() { return (this.lastInput.length>1)?(main.vocabulary[this.lastInput[1]] || -1):0; },
    move: function(go) { 
	    var currRoom = main.rooms[this.getRoom()];
	    var newRoom = currRoom.move(go);
	    if (newRoom < 0) {
	    	if (newRoom === 0) return 10;
	    	if (newRoom == -2) return 11;
	    }
	    else { 
	    	this.setRoom(newRoom);
	    	return main.rooms[newRoom].look();
	    }
    },
    getRoom: function() { return this.currentRoom; },
    setRoom: function(newRoom) { this.currentRoom = newRoom; },
    holding: function() { return this.inventory.length; },
    toting: function(i) { return this.inventory.indexOf(i) != -1; },
    here: function(i) { return (this.toting(i) || this.getRoom().here(i)); },
    do_take: function(i) {
    	if (i === 0) {  // no item specified
	    	// list of items in this room 
	    	var items_here = main.rooms[this.currentRoom].getItems();
	    	// check whether there's something we could take
	    	if (!items_here.length) return 'There\'s nothing here to take.';
    		if (items_here.length == 1) i = items_here[0]; // point to the one item
    		else return 'Please be more specific.'; // more items here
    	}
		//var item = items.filter(main.find())
    	console.log(i, main.actions[i]);
    	// do we have it already?
    	if (this.toting(i)) return 'You are already carrying it.';
    	// is the item present?
    	if (!main.rooms[this.currentRoom].here(i)) return 'No ' + main.items[i].getName() + ' here.';
    	// check whether it is fixed in place
    	if (main.items[i].isFixed()) return 'The ' + main.items[i].getName() + ' cannot be moved.';
    	// carrying the limit?
    	if (this.holding() == this.maxItems) return 'Your bag is full'; 
   		// now we can take ...
		main.rooms[this.currentRoom].take(i); 
		this.inventory.push(i); // we push the reffered item
		return main.items[i].getName().toProperCase() + ' taken.';
    },
    do_drop: function(i) {
    	if (i === 0) { // no item specified
    	}

    	if (this.holding() === 0) return 'You don\'t carry anything';
    	else {
    		var s = '';
    		for (var t in this.inventory) {
    			//var ref = main.items.indexOf(this.inventory[t]); // get a reference for this item
    			main.rooms[this.currentRoom].drop(this.inventory[t]);
    			s += main.items[this.inventory[t]].getName().toProperCase() + ' dropped.\n';
    		}
    		// clear inventory
    		this.inventory = [];
    		return s;
    	}
    },
    do_open: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_close: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_on: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_off: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_say: function() {
    	
    },
    do_wave: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_go: function(i) {
    	
    },
    do_attack: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_eat: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_drink: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_throw: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_find: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_rub: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_fill: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_blast: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_score: function() {
    	
    },
    do_brief: function() {
    	
    },
    do_read: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    },
    do_break: function(i) {
    	if (i === 0) { // no item specified
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
    	return main.rooms[this.getRoom()].look();
    },
    do_log: function(i) {
    	if (i === 0) { // no item specified
    		return main.toggleLogging();
    	}
    	else {
	    	if (main.items[i].getName() == 'database') {
				console.log(main.messages);
				console.log(main.rooms);
				console.log(main.items);
				console.log(main.actions);
				console.log(main.vocabulary);
	    	}
    	}
    },
    do_quit: function() {
    	
    }

};


