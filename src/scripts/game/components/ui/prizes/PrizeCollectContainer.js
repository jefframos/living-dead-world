import * as PIXI from 'pixi.js';

import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIUtils from '../../../core/utils/UIUtils';
import Utils from '../../../core/utils/Utils';

export default class PrizeCollectContainer extends MainScreenModal {
    constructor() {
        super();
        this.addScreenBlocker();
        this.prizesContainer = new PIXI.Container();
        this.container.addChild(this.prizesContainer);
    }
    addBackgroundShape() {


        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('card-shape-1'), 20, 20, 20, 20);
        this.container.addChild(this.infoBackContainer);
        this.infoBackContainer.tint = 0x000099;
    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = 450
            this.infoBackContainer.height = 450
        }
        this.contentContainer.x = 0
        this.contentContainer.y = 0

        this.blocker.width = Game.Borders.width
        this.blocker.height = Game.Borders.height

        this.recenterContainer();
    }

    showPrize(data) {
        console.log(data)

        let drawPrizes = [];
        for (let index = 0; index < data.type.length; index++) {
            const element = data.type[index];
            const value = data.value[index];
            let entityData = null;
            let texture = '';
            switch (element) {
                case PrizeManager.PrizeType.Coin:
                    texture = 'coin3l'
                    break;
                case PrizeManager.PrizeType.Companion:
                    entityData = EntityBuilder.instance.getCompanion(value.id)
                    texture = entityData.entityData.icon
                    break;
                case PrizeManager.PrizeType.Key:
                    texture = 'active_engine'
                    break;
                case PrizeManager.PrizeType.MasterKey:
                    texture = 'active_engine'
                    break;
                case PrizeManager.PrizeType.Mask:
                    entityData = EntityBuilder.instance.getMask(value.id)
                    texture = entityData.entityData.icon
                    break;
                case PrizeManager.PrizeType.Trinket:
                    entityData = EntityBuilder.instance.getTrinket(value.id)
                    texture = entityData.entityData.icon
                    break;
                case PrizeManager.PrizeType.Weapon:
                    entityData = EntityBuilder.instance.getWeapon(value.id)
                    texture = entityData.entityData.icon
                    break;
            }
            drawPrizes.push({ texture, entityData, value })
        }

        while (this.prizesContainer.children.length > 0) {
            this.prizesContainer.removeChildAt(0)
        }
        for (var i = 0; i < drawPrizes.length; i++) {
            const element = drawPrizes[i];

            let prize = null
            if (element.entityData) {
                prize = new LoadoutCardView( UIUtils.baseButtonTexture+'_0006', this.slotSize, this.slotSize);
                prize.setData(element.entityData, element.value.level + 1)
                prize.resetPivot()
                prize.x = 120 * i
            } else {
                prize = new PIXI.Sprite.from(element.texture)
            }

            prize.alpha = 0;
            TweenLite.to(prize, 0.5, {
                delay: i * 0.5 + 0.5, alpha: 1, onStart: () => {
                    this.prizesContainer.addChild(prize)
                }
            })

        }
    }
    update(delta) {
        if (!this.isOpen) {
            return;
        }
        super.update(delta)

        this.prizesContainer.x = Utils.lerp(this.prizesContainer.x, this.infoBackContainer.width / 2 - this.prizesContainer.width / 2, 0.2);
        this.prizesContainer.y = this.infoBackContainer.height / 2 - this.prizesContainer.height / 2;

    }
}