import * as PIXI from 'pixi.js';

import Screen from '../../screenManager/Screen'

export default class MainMenu extends Screen {
    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);
    }
    build(){
        super.build();

        setTimeout(() => {
            this.screenManager.change('GameScreen')
        }, 500);
    }
}