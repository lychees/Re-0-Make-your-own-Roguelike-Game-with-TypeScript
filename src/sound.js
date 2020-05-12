import {Howl, Howler} from 'howler';

export class Sound {    
    playSE(name) {          
        /*
        $(this.soundPlayerElt).jPlayer("setMedia", {
            'oga': 'assets/sound/' + name,
            'wav': 'assets/sound/' + name,
            'm4a': 'assets/sound/' + name            
        });
        $(this.soundPlayerElt).jPlayer('play');
        */
        let SE = new Howl({
            src: ['assets/sound/' + name]
        });      
        SE.play();
    }
}
