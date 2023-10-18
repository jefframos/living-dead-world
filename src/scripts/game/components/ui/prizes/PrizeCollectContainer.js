import * as PIXI from 'pixi.js';

import AcessoryData from '../../../data/AcessoryData';
import CharacterCustomizationContainer from '../customization/CharacterCustomizationContainer';
import ConfettiContainer from '../ConfettiContainer';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import GameData from '../../../data/GameData';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import LocalizationManager from '../../../LocalizationManager';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import WeaponData from '../../../data/WeaponData';
import signals from 'signals';

export default class PrizeCollectContainer extends MainScreenModal {
    constructor() {
        super();


        this.addScreenBlocker();



        this.confetti = new ConfettiContainer()
        this.addChildAt(this.confetti,0);
        this.topBlocker = new PIXI.Sprite.from('base-gradient');
        //this.topBlocker = new PIXI.Sprite.from('square_button_0001');
        //this.topBlocker.tint = 0x851F88;
        this.topBlocker.tint = 0;
        this.topBlocker.scale.y = -1
        this.addChildAt(this.topBlocker, 0);


        this.blocker.alpha = 1;
        this.blocker.tint = 0;

        //this.blocker.tint = 0x00ffbf;
        this.prizesContainer = new PIXI.Container();
        this.container.addChild(this.prizesContainer);


        this.blackout = UIUtils.getRect(0, 100, 100)
        this.blackout.alpha = 0.8
        this.addChildAt(this.blackout, 0);


        this.collectButton = UIUtils.getPrimaryLargeLabelButton(() => {
            this.hide()
        }, LocalizationManager.instance.getLabel('COLLECT'))
        this.collectButton.updateBackTexture('square_button_0002')
        this.container.addChild(this.collectButton);
        this.collectButton.buttonSound = 'Synth-Appear-01'

        this.slotSize = 100


        this.shine = new PIXI.Sprite.from('shine')
        this.shine.anchor.set(0.5)
        this.shine.scale.set(3)

        this.infoBackContainer.addChild(this.shine)
        this.shine.tint = 0xfff700
        this.shine.alpha = 0.5


        this.prizeBox = new PIXI.Sprite()//new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0006'), 20, 20, 20, 20);
        this.infoBackContainer.addChild(this.prizeBox);

        this.congratulationsLabel = UIUtils.getSpecialLabel2(LocalizationManager.instance.getLabel('COLLECT_PRIZE'), { fontSize: 32 })
        this.congratulationsLabel.anchor.set(0.5)

        this.infoBackContainer.addChild(this.congratulationsLabel)

        this.onLoadoutRedirect = new signals.Signal()
        this.onClothesRedirect = new signals.Signal()


    }
    addBackgroundShape() {
        this.modalTexture = null;
        super.addBackgroundShape();

    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width / 2

        this.container.pivot.y = this.container.height / 2
        this.container.y = Game.Borders.height / 2 - 80

    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = 550
            this.infoBackContainer.height = 580
        }
        this.contentContainer.x = 0
        this.contentContainer.y = 0

        this.blocker.width = Game.Borders.width
        this.blocker.height = Game.Borders.height

        this.blackout.width = Game.Borders.width
        this.blackout.height = Game.Borders.height

        this.topBlocker.width = Game.Borders.width
        this.topBlocker.height = Game.Borders.height
        this.topBlocker.scale.y = -1
        this.topBlocker.y = this.topBlocker.height

        this.collectButton.x = this.infoBackContainer.width / 2 - this.collectButton.width / 2;
        this.collectButton.y = this.infoBackContainer.height - this.collectButton.height / 2 + 80;

        this.prizeBox.width = this.infoBackContainer.width - 20
        this.prizeBox.height = 330
        this.prizeBox.x = 10
        this.prizeBox.y = this.infoBackContainer.height - this.prizeBox.height - 10

        this.congratulationsLabel.x = this.infoBackContainer.width / 2
        this.congratulationsLabel.y = this.infoBackContainer.height / 2 - 150

        this.shine.x = this.infoBackContainer.width / 2
        this.shine.y = this.congratulationsLabel.y

        this.recenterContainer();
    }

    showPrize(data) {
        console.log(data)
        SOUND_MANAGER.play('teleport', 0.8)
        let drawPrizes = [];
        for (let index = 0; index < data.type.length; index++) {
            const element = data.type[index];
            const value = data.value[index];
            let entityData = null;
            let texture = '';

            //console.log('showPrize' ,element, data)

            switch (element) {
                case PrizeManager.PrizeType.Coin:
                    texture = 'coin1'
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
                case PrizeManager.PrizeType.Wearable:
                    let tex = CharacterCustomizationContainer.instance.getSlotImage(value.value.area, value.value.id)
                    texture = tex
                    break;
            }
            drawPrizes.push({ texture, entityData, value })
        }

        console.log(drawPrizes)

        while (this.prizesContainer.children.length > 0) {
            this.prizesContainer.removeChildAt(0)
        }
        let col = 0
        let ln = 0
        const speed = Math.min(1.25, drawPrizes.length * 0.2);
        for (var i = 0; i < drawPrizes.length; i++) {
            const element = drawPrizes[i];

            let prize = null
            if (element.entityData) {
                prize = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
                prize.setData(element.entityData, element.value.level, 70)
                prize.resetPivot()
                prize.hideLevelLabel()
                prize.addEquipButton()
                prize.onEquip.add(() => {
                    // console.log('equip', element.entityData)
                    this.equip(element.entityData, element.value.level)
                });

            } else {
                let texShape = UIUtils.baseButtonTexture + '_0006'
                console.log(element.value, element.value == PrizeManager.PrizeType.Wearable)
                if (element.value.type == PrizeManager.PrizeType.Wearable) {
                    texShape = UIUtils.baseButtonTexture + '_0009'
                }
                prize = new LoadoutCardView(texShape, this.slotSize, this.slotSize);
                prize.setIcon(element.texture, 70)
                prize.resetPivot()
                prize.hideLevelLabel()
                prize.addWaredrobeButton()
                prize.onEquip.add(() => {
                    this.onClothesRedirect.dispatch();
                    this.hide()
                });

                if (typeof element.value == 'number') {

                    prize.valueLabel.text = element.value
                } else {

                    //prize.valueLabel.text = element.value.value
                }

                //  prize = new PIXI.Sprite.from(element.texture)
                // prize.scale.set(Utils.scaleToFit(prize, 70))
            }

            prize.x = (this.slotSize + 10) * col
            prize.y = (this.slotSize + 60) * ln

            if (col > 0 && col >= 4) {
                col = 0
                ln++
            } else {
                col++

            }

            prize.alpha = 0;
            TweenLite.to(prize, 0.25, {
                delay: i * speed / drawPrizes.length, alpha: 1, onStart: () => {
                    this.prizesContainer.addChild(prize)
                }
            })

        }

        this.collectButton.visible = false;
        this.collectButton.alpha = 0;
        this.resize()
        setTimeout(() => {
            this.collectButton.visible = true;

            TweenLite.to(this.collectButton, 0.5, { alpha: 1, ease: Back.easeOut })
        }, speed * 500 + 250);

    }
    equip(data, level) {
        setTimeout(() => {
            this.hide()
            this.onLoadoutRedirect.dispatch();
        }, 300);
        if (data instanceof AcessoryData) {
            if (data.bodyPart == 'trinket') {
                GameData.instance.changeTrinket(data.id, data.level);
                return

            } else {
                GameData.instance.changeShoe(data.id, data.level);
                return

            }
        }

        if (data instanceof WeaponData) {

            GameData.instance.changeMainWeapon(data.id, level);
            return
        }
        GameData.instance.changeCompanion(data.id, level);
    }
    update(delta) {
        if (!this.isOpen) {
            return;
        }
        super.update(delta)
        this.confetti.update(delta);
        this.confetti.x = Game.Borders.width / 2
        this.confetti.y = 0
        this.prizesContainer.x = Utils.lerp(this.prizesContainer.x, this.infoBackContainer.width / 2 - this.prizesContainer.width / 2, 0.2);
        this.prizesContainer.y = Utils.lerp(this.prizesContainer.y, this.prizeBox.y + this.prizeBox.height / 2 - this.prizesContainer.height / 2, 0.9);

        this.shine.rotation += delta * 3

    }
}