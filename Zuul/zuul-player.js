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
	    	if (newRoom == -1) return 10;
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
    here: function(i) { return (this.toting(i) || main.rooms[this.getRoom()].here(i)); },
    do_take: function(i) {
    	if (i === 0) {  // no item specified
	    	// list of items in this room 
	    	var items_here = main.rooms[this.getRoom()].getItems();
	    	// check whether there's something we could take
	    	if (!items_here.length) return 20;
    		if (items_here.length == 1) i = items_here[0]; // point to the one item
    		else return 21; // more items here
    	}
		//var item = items.filter(main.find())
    	main.log('take:'+i, main.actions[i]);
    	// do we have it already?
    	if (this.toting(i)) return 22;
    	// is the item present?
    	if (!main.rooms[this.getRoom()].here(i)) return [23, main.items[i].getName()]; //return 'No ' + main.items[i].getName() + ' here.';
    	// check whether it is fixed in place
    	if (main.items[i].isFixed()) return [24, main.items[i].getName()];//return 'The ' + main.items[i].getName() + ' cannot be moved.';
    	// carrying the limit?
    	if (this.holding() == this.maxItems) return 25; 
   		// now we can take ...
		main.rooms[this.getRoom()].take(i); 
		this.inventory.push(i); // we push the reffered item
		return [26, main.items[i].getName()]; 
	},
    do_drop: function(i) {
    	if (this.holding() === 0) return 30;
    	if (i === 0) { // no item specified, drop everything
    		var s = '';
    		for (var t in this.inventory) {
    			main.rooms[this.getRoom()].drop(this.inventory[t]);
    			s += main.items[this.inventory[t]].getName().toProperCase() + ' dropped.\n';
    		}
    		this.inventory = []; // clear inventory
    		return s;
    	}
    	if (!this.toting(i)) return [31, main.items[i].getName()];
    	main.rooms[this.getRoom()].drop(i);
    	main.log('drop (inventory):'+this.inventory);
    	this.inventory.splice(this.inventory.indexOf(i), 1);
    	return [32, main.items[i].getName()];
    },
    do_open: function(i) {
    	if (i === 0) { // no item specified
	    	// list of items in this room 
	    	var items_here = main.rooms[this.getRoom()].getItems();
	    	// check whether there's something we could open/unlock
	    	if (!items_here.length) return 35;
    		if (items_here.length == 1) i = items_here[0]; // point to the one item
    		else return 36; // more items here    	
    	}
    	if (!this.here(i)) return [37, main.items[i].getName()];
    	// can it be locked
    	if (!main.items[i].isLockable()) return [38, main.items[i].getName()];
    	// TODO: this is hardcoded; should find a way to specify actor and object 
    	main.log(main.actions[main.vocabulary.keys][2]);
    	if (!this.here(main.actions[main.vocabulary.keys][2])) return 39;
    	// unlock
    	main.items[i].incrStatus();
    	return [40, main.items[i].getName()];
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


