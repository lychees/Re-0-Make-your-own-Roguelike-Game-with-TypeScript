import * as $ from "jquery";


export var Button = {
	Button: function(options) {
		if(typeof options.cooldown == 'number') {
			this.data_cooldown = options.cooldown;
		}
		this.data_remaining = 0;
		if(typeof options.click == 'function') {
			this.data_handler = options.click;
		}

		var el = $('<div>')
			.attr('id', typeof(options.id) != 'undefined' ? options.id : "BTN_" + Engine.getGuid())
			.addClass('button')
			.text(typeof(options.text) != 'undefined' ? options.text : "button")
			.click(function() {
				if(!$(this).hasClass('disabled')) {
					Button.cooldown($(this));
					$(this).data("handler")($(this));
				}
			})
			.data("handler",  typeof options.click == 'function' ? options.click : function() { Engine.log("click"); })
			.data("remaining", 0)
			.data("cooldown", typeof options.cooldown == 'number' ? options.cooldown : 0);

		el.append($("<div>").addClass('cooldown'));

		// waiting for expiry of residual cooldown detected in state
		Button.cooldown(el, 'state');

		if(options.cost) {
			var ttPos = options.ttPos ? options.ttPos : "bottom right";
			var costTooltip = $('<div>').addClass('tooltip ' + ttPos);
			for(var k in options.cost) {
				$("<div>").addClass('row_key').text(_(k)).appendTo(costTooltip);
				$("<div>").addClass('row_val').text(options.cost[k]).appendTo(costTooltip);
			}
			if(costTooltip.children().length > 0) {
				costTooltip.appendTo(el);
			}
		}

		if(options.width) {
			el.css('width', options.width);
		}

		return el;
	},

	saveCooldown: true,

	setDisabled: function(btn, disabled) {
		if(btn) {
			if(!disabled && !btn.data('onCooldown')) {
				btn.removeClass('disabled');
			} else if(disabled) {
				btn.addClass('disabled');
			}
			btn.data('disabled', disabled);
		}
	},

	isDisabled: function(btn) {
		if(btn) {
			return btn.data('disabled') === true;
		}
		return false;
	},

	cooldown: function(btn, option) {
		var cd = btn.data("cooldown");
		var id = 'cooldown.'+ btn.attr('id');
		if(cd > 0) {
			if(typeof option == 'number') {
				cd = option;
			}
			// param "start" takes value from cooldown time if not specified
			var start, left;
			switch(option){
				// a switch will allow for several uses of cooldown function
				case 'state':
					if(!$SM.get(id)){
						return;
					}
					start = Math.min($SM.get(id), cd);
					left = (start / cd).toFixed(4);
					break;
				default:
					start = cd;
					left = 1;
			}
			Button.clearCooldown(btn);
			if(Button.saveCooldown){
				$SM.set(id,start);
				// residual value is measured in seconds
				// saves program performance
				btn.data('countdown', Engine.setInterval(function(){
					$SM.set(id, $SM.get(id, true) - 0.5, true);
				},500));
			}
			var time = start;
			if (Engine.options.doubleTime){
				time /= 2;
			}
			$('div.cooldown', btn).width(left * 100 +"%").animate({width: '0%'}, time * 1000, 'linear', function() {
				Button.clearCooldown(btn, true);
			});
			btn.addClass('disabled');
			btn.data('onCooldown', true);
		}
	},

	clearCooldown: function(btn, cooldownEnded) {
		var ended = cooldownEnded || false;
		if(!ended){
			$('div.cooldown', btn).stop(true, true);
		}
		btn.data('onCooldown', false);
		if(btn.data('countdown')){
			window.clearInterval(btn.data('countdown'));
			//$SM.remove('cooldown.'+ btn.attr('id'));
			btn.removeData('countdown');
		}
		if(!btn.data('disabled')) {
			btn.removeClass('disabled');
		}
	}
};



/**
 * Module that handles the random event system
 */
export let Events = {

	init: function() {

		this._EVENT_TIME_RANGE = [3, 6], // range, in minutes
		this._PANEL_FADE = 200,
		this._FIGHT_SPEED = 100,
		this._EAT_COOLDOWN = 5,
		this._MEDS_COOLDOWN = 7,
		this._LEAVE_COOLDOWN = 1,
		this.STUN_DURATION = 4000,
		this.BLINK_INTERVAL = false,    
		this.eventStack = [],
		this.activeScene = "",

		this.eventStack = [];
    },    
    


	stopTitleBlink: function() {
		clearInterval(this.BLINK_INTERVAL);
		Events.BLINK_INTERVAL = false;
    },
    
	endEvent: function() {
		Events.eventPanel().animate({opacity:0}, Events._PANEL_FADE, 'linear', function() {
			Events.eventPanel().remove();
			Events.activeEvent().eventPanel = null;
			Events.eventStack.shift();
		//	Engine.log(Events.eventStack.length + ' events remaining');
	//		Engine.keyLock = false;
	//		Engine.tabNavigation = true;
			Button.saveCooldown = true;
			if (Events.BLINK_INTERVAL) {
				Events.stopTitleBlink();
			}
			// Force refocus on the body. I hate you, IE.
			$('body').focus();
		});
	},    
    

	activeEvent: function() {
		if(this.eventStack && this.eventStack.length > 0) {
			return this.eventStack[0];
		}
		return null;
    },
        

	eventPanel: function() {
		return this.activeEvent().eventPanel;
    },
    

	// blinks the browser window title
	blinkTitle: function() {
        return;
    },    


	allowLeave: function(takeETbtn, leaveBtn){
		if(takeETbtn){
			if(leaveBtn){
				takeETbtn.data('leaveBtn', leaveBtn);
			}
			Events.canLeave(takeETbtn);
		}
	},

	canLeave: function(btn){
		var basetext = (btn.data('canTakeEverything')) ? _('take everything') : _('take all you can');
		var textbox = btn.children('span');
		var takeAndLeave = (btn.data('leaveBtn')) ? btn.data('canTakeEverything') : false;
		var text = _(basetext);
		if(takeAndLeave){
			Button.cooldown(btn);
			text += _(' and ') + btn.data('leaveBtn').text();
		}
		textbox.text( text );
		btn.data('canLeave', takeAndLeave);
	},    

	updateButtons: function() {
		var btns = Events.activeEvent().scenes[Events.activeScene].buttons;
		for(var bId in btns) {
			var b = btns[bId];
			var btnEl = $('#'+bId, Events.eventPanel());
			if(typeof b.available == 'function' && !b.available()) {
				Button.setDisabled(btnEl, true);
			}
		}
	},

	buttonClick: function(btn) {
        var info = Events.activeEvent().scenes[Events.activeScene].buttons[btn.attr('id')];            
		if(typeof info.onChoose == 'function') {
			info.onChoose();
		}
		Events.updateButtons();
		// Next Scene
		if (!info.nextScene) Events.endEvent();
		else Events.loadScene(info.nextScene);			
	},

	drawButtons: function(scene) {
		var btns = $('#exitButtons', Events.eventPanel());
		var btnsList = [];
		for(var id in scene.buttons) {
			var info = scene.buttons[id];
				var b = new Button.Button({
					id: id,
					text: info.text,
					cost: info.cost,
					click: Events.buttonClick,
					cooldown: info.cooldown
				}).appendTo(btns);
			if(typeof info.available == 'function' && !info.available()) {
				Button.setDisabled(b, true);
			}
			if(typeof info.cooldown == 'number') {
				Button.cooldown(b);
			}
			btnsList.push(b);
		}

		Events.updateButtons();
		return (btnsList.length == 1) ? btnsList[0] : false;
	},


	startStory: function(scene) {

		// Write the text
		var desc = $('#description', Events.eventPanel());
		var leaveBtn = false;
		for(var i in scene.text) {
			$('<div>').text(scene.text[i]).appendTo(desc);
        }
		
        // Draw any loot        
//		var takeETbtn;

		// Draw the buttons
		var exitBtns = $('<div>').attr('id','exitButtons').appendTo($('#description', Events.eventPanel()));		
		leaveBtn = Events.drawButtons(scene);
		$('<div>').addClass('clear').appendTo(exitBtns);
//		Events.allowLeave(takeETbtn, leaveBtn);
	},    
    
	loadScene: function(name) {
//		console.log(this.eventStack);
		Events.activeScene = name;

		var scene = Events.activeEvent().scenes[name];

		// onLoad
		if(scene.onLoad) {
			scene.onLoad();
		}

		$('#description', Events.eventPanel()).empty();
		$('#buttons', Events.eventPanel()).empty();

		Events.startStory(scene);
	},

	startEvent: function(event, options) {
		Events.eventStack.unshift(event);
		event.eventPanel = $('<div>').attr('id', 'event').addClass('dialogPanel').css('opacity', '0');
		if(options != null && options.width != null) {
			Events.eventPanel().css('width', options.width);
		}
		$('<div>').addClass('eventTitle').text(Events.activeEvent().title).appendTo(Events.eventPanel());
		$('<div>').attr('id', 'description').appendTo(Events.eventPanel());
		$('<div>').attr('id', 'buttons').appendTo(Events.eventPanel());
		Events.loadScene('start');
		$('#wrapper').append(Events.eventPanel());
		Events.eventPanel().animate({opacity: 1}, Events._PANEL_FADE, 'linear');
	},    
}

export function _(s){
    return s;
}
