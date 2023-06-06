import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import MainScreenModal from '../MainScreenModal';

export default class LocationContainer extends MainScreenModal {
    constructor() {
        super();

    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height /2 - 80

            this.infoBackContainer.x = 50
            this.infoBackContainer.y = Game.Borders.height - this.infoBackContainer.height - 50
        }

        this.contentContainer.x = 50
        this.contentContainer.y = Game.Borders.height - this.infoBackContainer.height - 50

    }
}