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

        this.topBlocker = new PIXI.Sprite.from('base-gradient');
        //this.topBlocker = new PIXI.Sprite.from('square_button_0001');
        this.topBlocker.tint = 0x851F88;
        this.topBlocker.scale.y = -1
        this.addChildAt(this.topBlocker, 0);


        this.blocker.alpha = 0.8;
        this.blocker.tint = 0x00ffbf;
        this.prizesContainer = new PIXI.Container();
        this.container.addChild(this.prizesContainer);


        this.collectButton = UIUtils.getPrimaryLargeLabelButton(() => {
            this.hide()
        }, 'collect')
        this.collectButton.updateBackTexture('square_button_0001')
        this.container.addChild(this.collectButton);

        this.slotSize = 70


        this.prizeBox = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0006'), 20, 20, 20, 20);
        this.infoBackContainer.addChild(this.prizeBox);



        this.shine = new PIXI.Sprite.from('shine')
        this.shine.anchor.set(0.5)
        this.shine.scale.set(3)

        this.infoBackContainer.addChild(this.shine)
        this.shine.tint = 0xfff700
        this.shine.alpha = 0.5


        this.congratulationsLabel = UIUtils.getSpecialLabel2('Collect your prize!', { fontSize: 32 })
        this.congratulationsLabel.anchor.set(0.5)

        this.infoBackContainer.addChild(this.congratulationsLabel)


    }
    addBackgroundShape() {
        this.modalTexture = 'modal_container0003';
        super.addBackgroundShape();

    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = 450
            this.infoBackContainer.height = 500
        }
        this.contentContainer.x = 0
        this.contentContainer.y = 0

        this.blocker.width = Game.Borders.width
        this.blocker.height = Game.Borders.height


        this.topBlocker.width = Game.Borders.width
        this.topBlocker.height = Game.Borders.height
        this.topBlocker.scale.y = -1
        this.topBlocker.y = this.topBlocker.height

        this.collectButton.x = this.infoBackContainer.width / 2 - this.collectButton.width / 2;
        this.collectButton.y = this.infoBackContainer.height - this.collectButton.height / 2;

        this.prizeBox.width = this.infoBackContainer.width - 20
        this.prizeBox.height = 300
        this.prizeBox.x = 10
        this.prizeBox.y = this.infoBackContainer.height - this.prizeBox.height -10

        this.congratulationsLabel.x = this.infoBackContainer.width / 2
        this.congratulationsLabel.y = this.infoBackContainer.height / 4 - 20

        this.shine.x = this.infoBackContainer.width / 2
        this.shine.y = this.infoBackContainer.height / 4 - 20

        this.recenterContainer();
    }

    showPrize(data) {
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
                case PrizeManager.PrizeType.Shoe:
                    entityData = EntityBuilder.instance.getShoe(value.id)
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
        let col = 0
        let ln = 0
        const speed = 0.15;
        for (var i = 0; i < drawPrizes.length; i++) {
            const element = drawPrizes[i];

            let prize = null
            if (element.entityData) {
                prize = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
                prize.setData(element.entityData, element.value.level, 50)
                prize.resetPivot()

            } else {
                prize = new PIXI.Sprite.from(element.texture)
                prize.scale.set(Utils.scaleToFit(prize, 70))
            }

            prize.x = 80 * col
            prize.y = 80 * ln

            if (col > 0 && col >= 4) {
                col = 0
                ln++
            } else {
                col++

            }

            prize.alpha = 0;
            TweenLite.to(prize, 0.5, {
                delay: i * speed + 0.25, alpha: 1, onStart: () => {
                    this.prizesContainer.addChild(prize)
                }
            })

        }

        this.collectButton.visible = false;
        this.collectButton.alpha = 0;
        setTimeout(() => {
            this.collectButton.visible = true;

            this.collectButton.y = this.infoBackContainer.height - 50;
            TweenLite.to(this.collectButton, 0.5, { alpha: 1, y: this.infoBackContainer.height + 10, ease: Back.easeOut })
        }, drawPrizes.length * speed*100 + 250);
    }
    update(delta) {
        if (!this.isOpen) {
            return;
        }
        super.update(delta)

        this.prizesContainer.x = Utils.lerp(this.prizesContainer.x, this.infoBackContainer.width / 2 - this.prizesContainer.width / 2, 0.2);
        this.prizesContainer.y = Utils.lerp(this.prizesContainer.y, this.prizeBox.y + this.prizeBox.height / 2 - this.prizesContainer.height / 2, 0.9);

        this.shine.rotation += delta * 3

    }
}