import * as PIXI from 'pixi.js';

import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import UILabelButton1 from '../ui/UILabelButton1';
import config from '../../config';
import SinglePrizeContainer from '../ui/SinglePrizeContainer';

export default class OpenChestPopUp extends PIXI.Container {
    constructor(label, screenManager) {
        super();
        this.screenManager = screenManager;
        this.label = label;
        this.onShow = new Signals();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onClose = new Signals();

        this.container = new PIXI.Container();
        this.chestContainer = new PIXI.Container();
        this.openChestContainer = new PIXI.Container();

        this.w = config.width * 0.75;
        this.h = config.width * 0.65;

        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5, config.width * 10, config.height * 10)
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        //this.background.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.background.visible = false

        this.popUp = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from('oct-no-pattern-purple'), 30, 30, 30, 30)
        this.popUp.width = this.w
        this.popUp.height = this.h

        this.popUp.pivot.x = this.popUp.width / 2
        this.popUp.pivot.y = this.popUp.height / 2
        // this.popUp.scale.set((this.size / this.popUp.width));
        this.popUp.alpha = 1;
        this.popUp.tint = 0xFFFFFF;
        // this.popUp.blendMode = PIXI.BLEND_MODES.ADD;

        this.container.interactive = true;
        this.container.addChild(this.popUp)
        this.container.x = 0//-this.container.width / 2;
        this.container.y = 0//-this.container.height / 2;
        this.addChild(this.container)
        this.container.addChild(this.chestContainer)
        this.container.addChild(this.openChestContainer)



        this.readyLabel = new PIXI.Text(window.localizationManager.getLabel('help-popup'), LABELS.LABEL_CHEST);
        this.readyLabel.style.fontSize = 18
        this.readyLabel.style.fill = 0xffffff
        this.readyLabel.pivot.x = this.readyLabel.width / 2;
        this.readyLabel.y = -40

        this.chestContainer.addChild(this.readyLabel)

        this.portrait = new PIXI.Sprite.from('portraitChest2')
        this.chestContainer.addChild(this.portrait)
        this.portrait.anchor.set(0.5, 1)
        this.portrait.y = -40

        this.chest1 = new PIXI.Sprite.from('chest1')
        this.chestContainer.addChild(this.chest1)
        this.chest1.anchor.set(0.5)
        this.chest1.scale.set(0.6)
        this.chest1.x = -75
        this.chest1.y = this.h / 2 - 120

        this.chest1.on('mouseup', this.openNormalChest.bind(this));
        this.chest1.on('touchend', this.openNormalChest.bind(this));
        this.chest1.interactive = true;
        this.chest1.buttonMode = true;

        this.openLabel = new PIXI.Text(window.localizationManager.getLabel('open', true), LABELS.LABEL2);
        this.openLabel.style.fontSize = 24
        this.openLabel.style.fill = 0xffffff
        this.openLabel.pivot.x = this.openLabel.width / 2;
        this.openLabel.pivot.y = this.openLabel.height / 2;
        this.openLabel.y = 65
        this.chest1.addChild(this.openLabel)



        this.shine = new PIXI.Sprite.from('shine')
        this.shine.anchor.set(0.5)
        this.shine.scale.set(2.2)
        this.shine.tint = 0xffff00
        this.shine.y = 50
        this.chestContainer.addChild(this.shine);

        this.chest2 = new PIXI.Sprite.from('chest3')
        this.chest2.anchor.set(0.5)
        this.chestContainer.addChild(this.chest2)
        this.chest2.x = 75
        this.chest2.y = this.h / 2 - 120

        this.chest2.on('mouseup', this.openVideoChest.bind(this));
        this.chest2.on('touchend', this.openVideoChest.bind(this));
        this.chest2.interactive = true;
        this.chest2.buttonMode = true;

        this.watchToOpen = new PIXI.Text(window.localizationManager.getLabel('open', true), LABELS.LABEL_CHEST);
        this.watchToOpen.style.fontSize = 24
        this.watchToOpen.style.stroke = 0x0090ff
        this.watchToOpen.style.fill = 0xffffff
        this.watchToOpen.pivot.x = this.watchToOpen.width / 2 - 30;
        this.watchToOpen.pivot.y = this.watchToOpen.height / 2;
        this.watchToOpen.y = 60
        this.chest2.addChild(this.watchToOpen)
        this.video = new PIXI.Sprite.from('video-trim')
        this.video.anchor.set(0.5)
        this.video.x = -this.video.width / 2 - 5;
        this.video.y = this.watchToOpen.height / 2;
        this.watchToOpen.addChild(this.video)

        this.container.visible = false;

        this.readySin = 0;


        this.shinePrize = new PIXI.Sprite.from('shine')
        this.shinePrize.anchor.set(0.5)
        this.shinePrize.scale.set(2.8)
        this.shinePrize.tint = 0xffff00
        this.shinePrize.alpha = 0.5
        this.openChestContainer.addChild(this.shinePrize);


        this.chosenChest = new PIXI.Sprite.from('chest3Open')
        this.chosenChest.anchor.set(0.5)
        this.openChestContainer.addChild(this.chosenChest)
        this.chosenChest.y = 40

        this.prizeShowData = {
            distance: 130,
            total: 3
        }
        this.prizes = []

        this.prizesData = [{
            icon: 'coin-large',
            color: 0x00ff00
        },
        {
            icon: 'shipPrize',
            color: 0x00ffff
        },
        {
            icon: 'shards-large',
            color: 0xad07fb
        }]
        for (let index = 0; index < this.prizeShowData.total; index++) {
            let prize = new SinglePrizeContainer();
            this.openChestContainer.addChild(prize)

            this.prizes.push(prize)
            prize.updateIcon(this.prizesData[index].icon)
            prize.updateLabel("20AA", this.prizesData[index].color)

            prize.x = this.prizeShowData.distance * index - (this.prizeShowData.distance * this.prizeShowData.total - 1 / 2);
            prize.y = -80
        }
        this.shinePrize.y = -80
        this.collectButton = new UILabelButton1(130)
        this.collectButton.addCenterLabel(window.localizationManager.getLabel('collect'))
        this.openChestContainer.addChild(this.collectButton)
        this.collectButton.pivot.x = this.collectButton.width / 2;
        this.collectButton.y = 100
        this.collectButton.onClick.add(() => {
            this.confirmCallback(this.prize[this.prizeID]);
            this.close()
        })


        this.chestData = [
            {
                chest: 'chest1',
                chestOpen: 'chest1Open',
                id: 0
            },
            {
                chest: 'chest2',
                chestOpen: 'chest2Open',
                id: 1
            },
            {
                chest: 'chest3',
                chestOpen: 'chest3Open',
                id: 2
            }
        ]
        this.isShowing = false;
        window.onSpacePressed.add(() => {
            if (!this.isShowing ) {
                return;
            }
            if (this.openChestContainer.visible) {
                this.confirmCallback(this.prize[this.prizeID]);
                this.close()
            }
            if (this.chestContainer.visible) {

                this.openVideoChest();
            }
        })

        window.onEscPressed.add(()=>{
            if (!this.isShowing ) {
                return;
            }
            if (this.openChestContainer.visible) {
                this.confirmCallback(this.prize[this.prizeID]);
                this.close()
            }
            if (this.chestContainer.visible) {

                this.openNormalChest();
            }
        })
    }
    openNormalChest() {
        this.prizes[1].updateIcon('shipPrize')
        this.chestContainer.visible = false;
        this.openChestContainer.visible = true;
        this.chosenChest.texture = PIXI.Texture.from(this.chosenChests[0].chestOpen);
        this.prizeID = this.chosenChests[0].id
        this.updatePrizes(this.chosenChests[0].id)

    }
    openVideoChest() {

        window.DO_REWARD(() => {
            this.openAfterAds();
        })
        //this.close()
    }
    openAfterAds() {
        this.chestContainer.visible = false;
        this.openChestContainer.visible = true;

        this.chosenChest.texture = PIXI.Texture.from(this.chosenChests[1].chestOpen);
        this.prizeID = this.chosenChests[1].id
        if (this.prizeID == 2) {
            this.prizes[1].updateIcon('shipPrize2')
        } else {
            this.prizes[1].updateIcon('shipPrize')
        }
        this.updatePrizes(this.chosenChests[1].id)

    }
    updatePrizes(total) {
        for (let index = 0; index < this.prizes.length; index++) {
            let prize = this.prizes[index]
            prize.visible = false;



        }
        this.prizes[0].updateLabel2(utils.formatPointsLabel(this.prize[this.prizeID].money))
        this.prizes[1].updateLabel2(window.localizationManager.getLabel('new-ship'))
        this.prizes[2].updateLabel2(utils.formatPointsLabel(this.prize[this.prizeID].shards))

        for (let index = 0; index < total + 1; index++) {
            let prize = this.prizes[index]
            prize.visible = true;
            prize.x = this.prizeShowData.distance * index - (this.prizeShowData.distance * total / 2);
            prize.y = -80
            prize.alpha = 0
            TweenLite.to(prize, 0.3, { delay: index * 0.2 + 0.1, alpha: 1 })
            TweenLite.from(prize, 0.5, { delay: index * 0.2 + 0.1, x: 0, y: 40, ease: Back.easeOut })
        }
    }

    update(delta) {
        this.readySin += delta * 8
        this.chest2.scale.set(Math.sin(this.readySin) * 0.05 + 0.95)

        this.shine.x = this.chest2.x
        this.shine.y = this.chest2.y
        this.shine.rotation += delta * 5
        this.shine.rotation %= Math.PI * 2

        this.shinePrize.rotation = this.shine.rotation
    }
    show(param) {
        this.visible = true;

        this.prize = param.prize;
        let level = Math.random() < 0.5 ? 0 : 1;

        this.chosenChests = [
            this.chestData[level],

            this.chestData[level + 1]
        ];

        this.chest1.texture = PIXI.Texture.from(this.chosenChests[0].chest);
        this.chest2.texture = PIXI.Texture.from(this.chosenChests[1].chest);

        this.isShowing = true;
        this.container.visible = true;
        this.background.visible = true;
        this.chestContainer.visible = true;
        this.openChestContainer.visible = false;
        this.toRemove = false;
        this.onShow.dispatch(this);
        this.portrait.texture = new PIXI.Texture.from('portraitChest' + Math.ceil(Math.random() * 3))
        if (param) {
            this.confirmCallback = param.onConfirm;
            this.cancelCallback = param.onCancel;
        } else {
            this.confirmCallback = null;
            this.cancelCallback = null;
        }
        //this.readyLabel.text = param ? param.label : ''
        this.readyLabel.pivot.x = this.readyLabel.width / 2;

        this.background.alpha = 0.5
        this.container.alpha = 1
        this.popUp.scale.x = 1
        this.popUp.scale.y = 1
    }
    afterHide() {

    }
    hide(dispatch = true, callback = null) {
        if (!this.isShowing) {
            return;
        }
        this.isShowing = false;

        TweenLite.to(this.background, 0.25, { alpha: 0 });
        TweenLite.to(this.container, 0.25, { alpha: 0 });
        TweenLite.to(this.popUp.scale, 0.25,
            {
                x: 0,
                y: 1.5,
                ease: Back.easeIn,
                onComplete: () => {
                    if (dispatch) {
                        this.onHide.dispatch(this);
                    }
                    if (callback) {
                        callback();
                    }
                    this.afterHide();
                    this.toRemove = true

                    this.visible = false;
                }
            })
    }
    confirm() {
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close() {
        this.onClose.dispatch(this);
        this.hide();
    }
}