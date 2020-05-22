import {Howl, Howler} from 'howler';

export class Sound {    
    playSE(name: string) {        
        let SE = new Howl({
            src: ['../assets/sound/' + name]            
        });
        SE.play();
    }
}
