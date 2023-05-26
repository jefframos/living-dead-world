import * as PIXI from 'pixi.js';

import Game from '../../../Game';

export default class MainScreenModal extends PIXI.Container {
    constructor() {
        super();

        this.container = new PIXI.Container();
        this.addChild(this.container)
        this.container.interactive = true;


        this.addBackgroundShape();
        this.contentContainer = new PIXI.Container();
        this.container.addChild(this.contentContainer)
    }
    addBackgroundShape() {
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

        if (this.infoBackContainer) {

            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 80

            this.infoBackContainer.x = 50
            this.infoBackContainer.y = 50
        }

        this.contentContainer.x = 50
        this.contentContainer.y = 50

    }
    update(delta) {

    }
    aspectChange(isPortrait) {

        if (isPortrait) {
        } else {

        }
    }
}