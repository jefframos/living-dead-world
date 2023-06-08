import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import MainScreenModal from '../MainScreenModal';
import RouletteView from './RouletteView';

export default class RouletteContainer extends MainScreenModal {
    constructor() {
        super();
        this.roulette = new RouletteView();
        this.contentContainer.addChild(this.roulette)
    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 80

            this.infoBackContainer.x = 50
            this.infoBackContainer.y = Game.Borders.height - this.infoBackContainer.height - 50
        }

        this.contentContainer.x = 0
        this.contentContainer.y = 0

    }
    addBackgroundShape() {
    }
    update(delta) {
        this.roulette.update(delta)
    }
    resize(res, newRes) {
        super.resize(res, newRes);
        this.contentContainer.x = Game.Borders.width/2 - this.roulette.width / 2
        this.contentContainer.y = Game.Borders.height/2 - this.roulette.height / 2
    }
}