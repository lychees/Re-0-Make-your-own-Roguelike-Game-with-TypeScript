import {Howl, Howler} from 'howler';
import { rand } from './utils';

export class Sound {    

    playSEs(list: Array<string>) {
        this.playSE(list[rand(list.length)]);
    }

    playSE(name: string) {        
        let SE = new Howl({
            html5: true,
            src: ['../assets/sound/' + name]
            // src: ['../2301398/assets/sound/' + name]            
        });
        SE.play();
    }
}
