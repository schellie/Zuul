/**
 * Game data & functions, related to the zuul character: player
 */
var player = {
    currentRoom: 1,
    maxItems: 3,
    inventory: [],
    lastInput: [],
    newInput: function(line) { this.lastInput = line.match(/\S+/g) || []; zuul.putDisplay(line, true); },
	processCommand: function() {
		player.newInput(zuul.getCommand());
		doAction(player.getVerb(), player.getItem());
	},
	// -1: no word given, undefined: unknown word, >0 valid word
	getVerb: function() { return (this.lastInput.length>0)?(zuul.vocabulary[this.lastInput[0]] || -1):0; },
    getItem: function() { return (this.lastInput.length>1)?(zuul.vocabulary[this.lastInput[1]] || -1):0; },
    move: function(go) { 
	    var currRoom = zuul.rooms[this.getRoom()];
	    var newRoom = currRoom.move(go);
	    if (newRoom < 0) {
	    	if (newRoom == -1) return 10;
	    	if (newRoom == -2) return 11;
	    }
	    else { 
	    	this.setRoom(newRoom);
	    	return zuul.rooms[newRoom].look();
	    }
    },
    getRoom: function() { return this.currentRoom; },
    setRoom: function(newRoom) { this.currentRoom = newRoom; },
    holding: function() { return this.inventory.length; },
    toting: function(i) { return this.inventory.indexOf(i) != -1; },
    here: function(i) { return (this.toting(i) || zuul.rooms[this.getRoom()].here(i)); },
    do_take: function(i) {
    	if (i === 0) {  // no item specified
	    	// list of items in this room 
	    	var items_here = zuul.rooms[this.getRoom()].getItems();
	    	// check whether there's something we could take
	    	if (!items_here.length) return 20;
    		if (items_here.length == 1) i = items_here[0]; // point to the one item
    		else return 21; // more items here
    	}
		//var item = items.filter(zuul.find())
    	log('take:'+i, zuul.actions[i]);
    	// do we have it already?
    	if (this.toting(i)) return 22;
    	// is the item present?
    	if (!zuul.rooms[this.getRoom()].here(i)) return [23, zuul.items[i].getName()]; //return 'No ' + zuul.items[i].getName() + ' here.';
    	// check whether it is fixed in place
    	if (zuul.items[i].isFixed()) return [24, zuul.items[i].getName()];//return 'The ' + zuul.items[i].getName() + ' cannot be moved.';
    	// carrying the limit?
    	if (this.holding() == this.maxItems) return 25; 
   		// now we can take ...
		zuul.rooms[this.getRoom()].take(i); 
		this.inventory.push(i); // we push the reffered item
		return [26, zuul.items[i].getName()]; 
	},
    do_drop: function(i) {
    	if (this.holding() === 0) return 30;
    	if (i === 0) { // no item specified, drop everything
    		var s = '';
    		for (var t in this.inventory) {
    			zuul.rooms[this.getRoom()].drop(this.inventory[t]);
    			s += zuul.items[this.inventory[t]].getName().toProperCase() + ' dropped.\n';
    		}
    		this.inventory = []; // clear inventory
    		return s;
    	}
    	if (!this.toting(i)) return [31, zuul.items[i].getName()];
    	zuul.rooms[this.getRoom()].drop(i);
    	log('drop (inventory):'+this.inventory);
    	this.inventory.splice(this.inventory.indexOf(i), 1);
    	return [32, zuul.items[i].getName()];
    },
    do_open: function(i) {
    	if (i === 0) { // no item specified
	    	// list of items in this room 
	    	var items_here = zuul.rooms[this.getRoom()].getItems();
	    	// check whether there's something we could open/unlock
	    	if (!items_here.length) return 35;
    		if (items_here.length == 1) i = items_here[0]; // point to the one item
    		else return 36; // more items here    	
    	}
    	if (!this.here(i)) return [37, zuul.items[i].getName()];
    	// can it be locked
    	if (!zuul.items[i].isLockable()) return [38, zuul.items[i].getName()];
    	// TODO: this is hardcoded; should find a way to specify actor and object 
    	log(zuul.actions[zuul.vocabulary.keys][2]);
    	if (!this.here(zuul.actions[zuul.vocabulary.keys][2])) return 39;
    	// unlock
    	zuul.items[i].incrStatus();
    	return [40, zuul.items[i].getName()];
    },
    do_close: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_on: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_off: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_say: function() {
    	
    	return 1;
    },
    do_wave: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_go: function(i) {
    	
    	return 1;
    },
    do_attack: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_eat: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_drink: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_throw: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_find: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_rub: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_fill: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_blast: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_score: function() {
    	
    	return 1;
    },
    do_brief: function() {
    	
    	return 1;
    },
    do_read: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_break: function(i) {
    	if (i === 0) { // no item specified
    	}    	
    	return 1;
    },
    do_inventory: function () {
    	var s = (this.inventory.length > 0) ? 'You hold:\n' : 'You don\'t hold anything\n';
        this.inventory.forEach(function (e, i) {
            s += '- ' + zuul.items[e].show() + '\n';
        });
        return s.slice(0, -1);
    },
    do_look: function () {
    	return zuul.rooms[this.getRoom()].look();
    },
    do_log: function(i) {
    	if (i === 0) { // no item specified
    		return zuul.toggleLogging();
    	}
    	else {
	    	if (zuul.items[i].getName() == 'database') {
				console.log(zuul.messages);
				console.log(zuul.rooms);
				console.log(zuul.items);
				console.log(zuul.actions);
				console.log(zuul.vocabulary);
	    	}
    	}
    },
    do_quit: function() {
    	
    }

};


