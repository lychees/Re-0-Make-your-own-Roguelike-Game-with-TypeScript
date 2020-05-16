import * as $ from "jquery";
import { Creature } from "../creature";

export function genCharacterUI(p: Creature) {

	let z = {
		title: null,
		scenes: null
	};

	z.title = p.name;
	z.scenes = {
        'start': {
            text: [
                'test'
            ],
            buttons: {
                'open': {
                    text: '123',
                    nextScene: {1: 'open'}
                },
                'destroy': {
                    text: '暴力破壞',
                    nextScene: {1: 'destory'}
                },
                'leave': {
                    text: '離開它，這或許是一個陷阱。',
                    nextScene: 'end'
                }
            }
		}
	}
	return z;
}