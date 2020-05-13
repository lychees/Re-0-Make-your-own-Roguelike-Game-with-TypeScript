import {Howl, Howler} from 'howler';

export class Sound {    
    playSE(name) {        
        let SE = new Howl({
            src: ['../assets/sound/' + name]            
        });
        SE.play();
    }
}
