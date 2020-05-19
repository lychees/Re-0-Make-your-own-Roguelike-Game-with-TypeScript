import $ from "jquery";
import { game } from "./main";

export class Button {

	data_cooldown: any;
	data_remaining: any;
	data_handler: any;
	saveCooldown: any;
	dom: any;

	constructor(options: any) {
		if(typeof options.cooldown == 'number') {
			this.data_cooldown = options.cooldown;
		}
		this.data_remaining = 0;
		if(typeof options.click == 'function') {
			this.data_handler = options.click;
		}

		let el = $('<div>')
			.attr('id', typeof(options.id) != 'undefined' ? options.id : "undefined")
			.addClass('button')		
			.text(options.text)
			.click(function() {
				//if(!$(this).hasClass('disabled')) {
					//Button.cooldown($(this));
					$(this).data("handler")($(this));
				//}
			})
			.data("handler",  typeof options.click == 'function' ? options.click : function() { console.log("click"); });
			
			/*.click(function() {
				if(!$(this).hasClass('disabled')) {
					//Button.cooldown($(this));
					$(this).data("handler")($(this));
				}
			})*/
			/*.data("handler",  typeof options.click == 'function' ? options.click : function() { Engine.log("click"); })
			.data("remaining", 0)
			.data("cooldown", typeof options.cooldown == 'number' ? options.cooldown : 0);*/

		el.append($("<div>").addClass('cooldown'));

		// waiting for expiry of residual cooldown detected in state
		//Button.cooldown(el, 'state');

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

		this.dom = el;

		//return el;
	}


	setDisabled(btn: any, disabled: any) {
		if(btn) {
			if(!disabled && !btn.data('onCooldown')) {
				btn.removeClass('disabled');
			} else if(disabled) {
				btn.addClass('disabled');
			}
			btn.data('disabled', disabled);
		}
	}

	isDisabled(btn) {
		if(btn) {
			return btn.data('disabled') === true;
		}
		return false;
	}

	cooldown(btn : any, option? : any) {
		/*
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
		*/
	}

	clearCooldown(btn : any, cooldownEnded : any) {
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
export class Events {

	_EVENT_TIME_RANGE: any;
	_PANEL_FADE: any;
	_FIGHT_SPEED: any;
	_EAT_COOLDOWN : 5;
	_MEDS_COOLDOWN : 7;
	_LEAVE_COOLDOWN : 1;
	STUN_DURATION : 4000;
	BLINK_INTERVAL : false;
	eventStack : Array<any>;
	btnsList: Array<any>;
	activeScene : "";

	tempFun: any;
	

	constructor() {
		this.btnsList = new Array<any>();
		this.eventStack = new Array<any>();
		this.init();
	}

	init() {
		this._EVENT_TIME_RANGE = [3, 6]; // range, in minutes
		this._PANEL_FADE = 200;
		this._FIGHT_SPEED = 100;
		this._EAT_COOLDOWN = 5;
		this._MEDS_COOLDOWN = 7;
		this._LEAVE_COOLDOWN = 1;
		this.STUN_DURATION = 4000;
		this.BLINK_INTERVAL = false;
		this.activeScene = "";
    }
    
	stopTitleBlink() {
		//clearInterval(this.BLINK_INTERVAL);
		//this.BLINK_INTERVAL = false;
    }
    
	endEvent() {
		this.eventPanel().animate({opacity:0}, this._PANEL_FADE, 'linear', () => {
			this.eventPanel().remove();
			this.activeEvent().eventPanel = null;
			this.eventStack.shift();
		//	Engine.log(this.thistack.length + ' this remaining');
	//		Engine.keyLock = false;
	//		Engine.tabNavigation = true;
			//Button.saveCooldown = true;
			if (this.BLINK_INTERVAL) {
				this.stopTitleBlink();
			}
			// Force refocus on the body. I hate you, IE.
			$('body').focus();
		});
		
		this.close();
	}
    
	activeEvent(): any {

		//console.log(this.eventStack);

		if(this.eventStack && this.eventStack.length > 0) {
			return this.eventStack[0];
		}
		return null;
    }
        

	eventPanel() {
		return this.activeEvent().eventPanel;
    }
    
	blinkTitle() {
        return;
    }


	allowLeave(takeETbtn, leaveBtn){
		if(takeETbtn){
			if(leaveBtn){
				takeETbtn.data('leaveBtn', leaveBtn);
			}
			this.canLeave(takeETbtn);
		}
	}

	canLeave(btn){
		var basetext = (btn.data('canTakeEverything')) ? _('take everything') : _('take all you can');
		var textbox = btn.children('span');
		var takeAndLeave = (btn.data('leaveBtn')) ? btn.data('canTakeEverything') : false;
		var text = _(basetext);
		/*if(takeAndLeave){
			Button.cooldown(btn);
			text += _(' and ') + btn.data('leaveBtn').text();
		}*/
		textbox.text( text );
		btn.data('canLeave', takeAndLeave);
	}

	updateButtons() {
		var btns = this.activeEvent().scenes[this.activeScene].buttons;
		for(var bId in btns) {
			var b = btns[bId];
			var btnEl = $('#'+bId, this.eventPanel());
			/*if(typeof b.available == 'function' && !b.available()) {
				Button.setDisabled(btnEl, true);
			}*/
		}
	}

	buttonClick(btn: any) {
		
		var info = this.activeEvent().scenes[this.activeScene].buttons[btn.attr('id')];
		if (info.text) game.player.logs.notify(info.text);

		if(typeof info.onChoose == 'function') {
			info.onChoose();
		}
		this.updateButtons();
		// Next Scene
		if (!info.nextScene) this.endEvent();
		else this.loadScene(info.nextScene);			
	}

	drawButtons(scene) {
		var btns = $('#exitButtons', this.eventPanel());
		var btnsList = [];
		for(var id in scene.buttons) {
			var info = scene.buttons[id];
				var b = new Button({
					id: id,
					text: info.text,
					cost: info.cost,
					click: this.buttonClick.bind(this),
					cooldown: info.cooldown
				});
				
				b.dom.appendTo(btns);
			/*if(typeof info.available == 'function' && !info.available()) {
				Button.setDisabled(b, true);
			}
			if(typeof info.cooldown == 'number') {
				Button.cooldown(b);
			}*/
			btnsList.push(b.dom);
		}

		this.btnsList = btnsList;
		this.updateButtons();
		return (btnsList.length == 1) ? btnsList[0] : false;
	}


	startStory(scene: any) {

		// Write the text
		var desc = $('#description', this.eventPanel());
		var leaveBtn = false;
		for(var i in scene.text) {
			$('<div>').text(scene.text[i]).appendTo(desc);

			game.player.logs.notify(scene.text[i]);
        }
		
        // Draw any loot        
//		var takeETbtn;

		// Draw the buttons
		var exitBtns = $('<div>').attr('id','exitButtons').appendTo($('#description', this.eventPanel()));		
		leaveBtn = this.drawButtons(scene);
		$('<div>').addClass('clear').appendTo(exitBtns);
//		this.allowLeave(takeETbtn, leaveBtn);
	}
    
	loadScene(name) {
//		console.log(this.thistack);
		this.activeScene = name;

		var scene = this.activeEvent().scenes[name];

		// onLoad
		if(scene.onLoad) {
			scene.onLoad();
		}

		$('#description', this.eventPanel()).empty();
		$('#buttons', this.eventPanel()).empty();

		this.startStory(scene);
	}

	close() {
		window.addEventListener("keydown", game.player);
		window.removeEventListener("keydown", this);
		//event.eventPanel.eventPanel()();
		this.eventPanel().remove();
		game.player.handleEvent = this.tempFun.bind(game.player);
	}
	

	startEvent(event: any, options? : any) {

		/*close() {
			game.SE.playSE("Wolf RPG Maker/[01S]cancel.ogg");
			window.removeEventListener("keydown", this);
			if (this.parent) window.addEventListener("keydown", this.parent);
			if (this.menu) this.menu.remove();
		}
		open() {*/
			//if (this.menu) this.menu.show();
			//game.SE.playSE("Wolf RPG Maker/[System]Enter02_Koya.ogg");
		//if (this.parent) 


		this.tempFun = game.player.handleEvent;
		game.player.handleEvent = function(){};

		
		window.removeEventListener("keydown", game.player);
		window.addEventListener("keydown", this);
		//}


		this.eventStack.unshift(event);
		event.eventPanel = $('<div>').attr('id', 'event').addClass('dialogPanel').css('opacity', '0');
		if(options != null && options.width != null) {
			this.eventPanel().css('width', options.width);
		}
		$('<div>').addClass('eventTitle').text(this.activeEvent().title).appendTo(this.eventPanel());
		$('<div>').attr('id', 'description').appendTo(this.eventPanel());
		$('<div>').attr('id', 'buttons').appendTo(this.eventPanel());
		this.loadScene('start');
		$('#wrapper').append(this.eventPanel());
		this.eventPanel().animate({opacity: 1}, this._PANEL_FADE, 'linear');
		
	}   
	
    handleEvent(e) {		
		//let scene = this.activeEvent().scenes[name];
		if (this.btnsList.length > 0) {
			if (this.btnsList[0]) {
				this.btnsList[0].click();
			}
		}
    }	
}

export function _(s){
    return s;
}
