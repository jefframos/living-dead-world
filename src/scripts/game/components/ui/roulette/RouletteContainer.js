import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import RouletteView from './RouletteView';
import Utils from '../../../core/utils/Utils';

export default class RouletteContainer extends MainScreenModal {
    constructor() {
        super();
        this.roulette = new RouletteView(Game.Screen.width - 40, Game.Screen.height / 2);
        this.contentContainer.addChild(this.roulette)

        this.roulette.onPrizeFound.add(this.givePrize.bind(this))
    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = Game.Borders.width - 80
            this.infoBackContainer.height = Game.Borders.height - 80
        }

        this.contentContainer.x = 0
        this.contentContainer.y = 0

    }
    givePrize(type, id, amount) {
        if (type === 0) {
            setTimeout(() => {
                PrizeManager.instance.getMetaLowerPrize();
            }, 1000);
        } else {

            setTimeout(() => {
                PrizeManager.instance.getMetaPrize(id, amount);
            }, 1000);
        }
    }
    addBackgroundShape() {
    }
    update(delta) {
        this.roulette.update(delta)
    }
    resize(res, newRes) {
        super.resize(res, newRes);

    }
}