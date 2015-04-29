/**
 * Game data & functions, related to the zuul character: player
 */
var player = {
    currentRoom: {},
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
	    var newRoom = this.getRoom().move(go);
	    if (newRoom < 0) {
	    	if (newRoom == -1) return 10;
	    	if (newRoom == -2) return 11;
	    }
	    else { 
	    	this.setRoom(newRoom);
	    	return this.getRoom().look();
	    }
    },
    getRoom: function() { return this.currentRoom; },
    setRoom: function(newRoom) { this.currentRoom = zuul.rooms[newRoom]; },
    holding: function() { return this.inventory.length; },
    toting: function(i) { return this.inventory.indexOf(i) != -1; },
    here: function(i) { return (this.toting(i) || this.getRoom().here(i)); },
    message: function(s, p, i) { return s.replace(/%p/, p).replace(/%i/, i); },
    do_take: function(p, i) {
    	if (i === 0) {  // no item specified
	    	// list of items in this room 
	    	var items_here = this.getRoom().getItems();
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
    	if (!this.getRoom().here(i)) return [23, i.getName()]; 
    	// check whether it is fixed in place
    	if (i.isFixed()) return [24, i.getName()];
    	// carrying the limit?
    	if (this.holding() == this.maxItems) return 25; 
   		// now we can take ...
		i = this.getRoom().take(i); 
		this.inventory.push(i[0]); // we push the reffered item
		return [26, i[0].getName()]; 
	},
    do_drop: function(p, i) {
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
    do_open: function(p, i) {
    	log(p);
    	if (i === 0) { // no item specified
	    	// list of items in this room 
	    	var items_here = this.getRoom().getItems();
	    	// check whether there's something we could open/unlock
	    	if (!items_here.length) return 35;
    		if (items_here.length == 1) i = items_here[0]; // point to the one item
    		else return 36; // more items here    	
    	}
    	if (!this.here(i)) return [37, i.getName()];
    	// can it be locked? 
    	// check properties and abilities in this place
    	if (!i.hasProp(p)) return [38, i.getName()];
    	var propOk = i.checkProp(p, this.inventory);
    	if (!propOk) propOk = i.checkProp(p, this.getRoom().getItems());
    	if (!propOk) return 39;
    	// unlock
    	return [40, i.getName()];
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
    do_wave: function(p, i) {
    	var mssg = [
    	  'There is nothing here to %p.',
    	  'Please, be more specific.',
    	  'I see no %i here.',
    	  'You cannot %p with a %i.',
    	  'You have nothing to %p with.',
    	  'You %p but nothing happens'
    	 ];
    	
    	if (i === 0) { // no item specified
	    	// list of items in this room 
	    	var items_here = this.getRoom().getItems();
	    	if (!items_here.length) return this.message(mssg[0], p, '');
    		if (items_here.length == 1) i = items_here[0]; // point to the one item
    		else return this.message(mssg[1], p, ''); // more items here    	
    	}
    	if (!this.here(i)) return this.message(mssg[2], p, i.getName());

    	// check properties and abilities in this place
    	if (!i.hasProp(p)) return this.message(mssg[3], p, i.getName());

    	var propOk = i.checkProp(p, this.inventory);
    	if (!propOk) propOk = i.checkProp(p, this.getRoom().getItems());
    	if (!propOk) return this.message(mssg[4], p, i.getName());
    	// unlock
    	return this.message(mssg[5], p, i.getName());
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
    do_inventory: function (p) {
    	var s = (this.inventory.length > 0) ? 'You hold:\n' : 'You don\'t hold anything\n';
        this.inventory.forEach(function (e, i) {
            s += '- ' + e.show() + '\n';
        });
        return s.slice(0, -1);
    },
    do_look: function (p) {
    	return this.getRoom().look();
    },
    do_log: function(p, i) {
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


