import * as $ from "jquery";

export class Logs {

    logs: Array<String>;

    constructor() {
        this.logs = Array<String>();
        this.init();
    }
	
	init() {
        var elem = $('<div>').attr({
            id: 'logs',
            class: 'logs'
        });    
        $('<div>').attr('id', 'logs_gradient').appendTo(elem);        
        elem.appendTo($("div#wrapper")); 
        console.log($("div#wrapper"));
	}
		
	push(text: string) {      
        this.logs.push(text);
    }
    
    notify(text: string) {              
        this.push(text);
        this.printMessage(text);
	}
	
	clearHidden() {
		var bottom = $('#logs_gradient').position().top + $('#logs_gradient').outerHeight(true);		
		$('.logs').each(function() {		
			if($(this).position().top > bottom){
				$(this).remove();
			}		
		});		
	}
	
	printMessage(t: string) {
		let text = $('<div>').addClass('logs').css('opacity', '0').text(t).prependTo('div#logs');
		text.animate({opacity: 1}, 500, 'linear', () => {
			this.clearHidden();
		});
	}
};