import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import RouletteView from './RouletteView';
import UIUtils from '../../../core/utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class RouletteContainer extends MainScreenModal {
    constructor() {
        super();
        this.roulette = new RouletteView(750, 500);

        this.blackout = UIUtils.getRect(0x3d1468, 100, 100)
        this.blackout.alpha = 0.8



        this.spheres = [];

        this.shine1 = new PIXI.Sprite.from('shine')
        this.addChildAt(this.shine1, 0)
        this.shine1.tint = 0x09ffbc
        this.shine1.anchor.set(0.5)

        this.shine2 = new PIXI.Sprite.from('shine')
        this.addChildAt(this.shine2, 0)
        this.shine2.tint = 0xe509ff
        this.shine2.rotation = 0.45
        this.shine2.anchor.set(0.5)

        this.addChildAt(this.blackout, 0)
        this.contentContainer.addChild(this.roulette)

        this.roulette.onPrizeFound.add(this.givePrize.bind(this))


        this.visible = false;
    }
    show() {
        super.show();

        this.alpha = 0.5;
        TweenLite.killTweensOf(this)

        TweenLite.to(this, 0.25, { alpha: 1 })
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
        this.shine1.rotation += delta * 2
        this.shine2.rotation += delta * 2



        let size = Math.max(Game.Borders.width, Game.Borders.height) * 0.5
        this.shine1.width = size + Math.cos(Game.Time*5) * size*0.1
        this.shine1.height = size+ Math.sin(Game.Time*5) * size*0.1


        this.shine2.width = size + Math.sin(Game.Time*5) * size*0.1
        this.shine2.height = size+ Math.cos(Game.Time*5) * size*0.1
    }
    resize(res, newRes) {
        super.resize(res, newRes);
        this.blackout.width = Game.Borders.width
        this.blackout.height = Game.Borders.height

        this.shine1.x = Game.Borders.width / 2
        this.shine1.y = Game.Borders.height / 2


        this.shine2.x = Game.Borders.width / 2
        this.shine2.y = Game.Borders.height / 2
    }
}