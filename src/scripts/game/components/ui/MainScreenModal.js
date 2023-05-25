import * as PIXI from 'pixi.js';

import Game from '../../../Game';

export default class MainScreenModal extends PIXI.Container {
    constructor() {
        super();

        this.container = new PIXI.Container();
        this.addChild(this.container)

        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('infoBack'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);


    }
    get isOpen() {
        return this.container.visible;
    }
    show() {
        this.container.visible = true;
    }
    hide() {
        this.container.visible = false;
    }
    resize(res, newRes) {

        this.infoBackContainer.width = Game.Borders.width - 80
        this.infoBackContainer.height = Game.Borders.height - 80

        this.infoBackContainer.x = 50
        this.infoBackContainer.y = 50


    }

    aspectChange(isPortrait) {

        if (isPortrait) {
        } else {

        }
    }
}