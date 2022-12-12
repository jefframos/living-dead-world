import * as PIXI from 'pixi.js';

import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import UILabelButton1 from '../ui/UILabelButton1';
import config from '../../config';
import SinglePrizeContainer from '../ui/SinglePrizeContainer';
import TextBox from '../ui/TextBox';
import UIList from '../ui/uiElements/UIList';

export default class SellAllPopUp extends PIXI.Container {
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
        this.h = config.height * 0.65;

        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5, config.width * 10, config.height * 10)
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('mousedown', this.close.bind(this)).on('touchstart', this.close.bind(this));
        this.background.visible = false

        this.popUp = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from('oct-no-pattern-yellow'), 30, 30, 30, 30)
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


        this.portrait = new PIXI.Sprite.from('femalePurple')
        this.chestContainer.addChild(this.portrait)
        this.portrait.anchor.set(0.5, 1)
        this.portrait.y = -40


        this.textBox = new TextBox(20);
        this.textBox.updateText('Thanks for helping us\nChoose your prize')

        this.textBoxPrize = new TextBox(20);
        this.textBoxPrize.updateText('++ Damage\n++ Resources')

        this.chestContainer.addChild(this.textBox)
        this.chestContainer.addChild(this.textBoxPrize)

        this.chestContainer.y = - 100
 
        this.textBoxPrize.x = 0
        this.textBoxPrize.y = 50


        this.shine = new PIXI.Sprite.from('shine')
        this.shine.anchor.set(0.5)
        this.shine.scale.set(2.2)
        this.shine.tint = 0xffff00
        this.shine.y = 50
        this.chestContainer.addChild(this.shine);

        this.chest2 = new PIXI.Sprite.from('shards-large')
        this.chest2.anchor.set(0.5)
        this.chest2.scale.set(1.5)
        this.chestContainer.addChild(this.chest2)
        this.chest2.x = 0
        this.chest2.y = this.h / 2 - 60

        this.chest2.on('mouseup', this.openVideoChest.bind(this));
        this.chest2.on('touchend', this.openVideoChest.bind(this));
        this.chest2.interactive = true;
        this.chest2.buttonMode = true;

        this.watchToOpen = new PIXI.Text(window.localizationManager.getLabel('sell', true), LABELS.LABEL_CHEST);
        this.watchToOpen.style.fontSize = 14
        this.watchToOpen.style.fill = 0xffffff
        this.watchToOpen.pivot.x = this.watchToOpen.width / 2 - 30;
        this.watchToOpen.pivot.y = this.watchToOpen.height / 2;
        this.watchToOpen.y = 60
        this.chest2.addChild(this.watchToOpen)
        this.video = new PIXI.Sprite.from('video-purple')
        this.video.anchor.set(0.5)
        this.video.x = -this.video.width / 2 - 5;
        this.video.y = this.watchToOpen.height / 2;
        this.watchToOpen.addChild(this.video)

        this.container.visible = false;

        this.readySin = 0;
        

        this.openShop = new UIButton1(0xFFffff, window.TILE_ASSSETS_POOL['image-X'], 0xFFffff, 60, 60, 'boss-button')
        this.openShop.updateIconScale(0.5)
        this.container.addChild(this.openShop)
        this.openShop.x = -this.w/2 + 50
        this.openShop.y = -this.h/2 +50
        this.openShop.onClick.add(() => {
            this.close()
        })



        this.plusIcons = new UIList();
        this.plusIcons.h = 79;
        this.plusIcons.w = 180;
        this.container.addChild(this.plusIcons)
        let coins = new PIXI.Sprite.from('plus-coins')
        let damage = new PIXI.Sprite.from('plus-damage')
        this.plusIcons.addElement(coins)
        this.plusIcons.addElement(damage)
        this.plusIcons.updateHorizontalList()
        this.plusIcons.x = -this.plusIcons.w/2
        this.plusIcons.y = -60

        this.shinePrize = new PIXI.Sprite.from('shine')
        this.shinePrize.anchor.set(0.5)
        this.shinePrize.scale.set(2.8)
        this.shinePrize.tint = 0xffff00
        this.shinePrize.alpha = 0.5
        this.openChestContainer.addChild(this.shinePrize);


        this.prizeShowData = {
            distance: 130,
            total: 1
        }
        this.prizes = []

        this.prizesData = [{
            icon: 'shards-large',
            color: 0xad07fb
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
        this.collectButton.y = 120
        this.collectButton.onClick.add(() => {
            this.close()
        })
        this.isShowing = false
        window.onSpacePressed.add(()=>{
            if(!this.isShowing){
                return;
            }
            this.openVideoChest();
        })
        window.onEscPressed.add(()=>{
            if(!this.isShowing){
                return;
            }
            this.close()
        })
        
       
    }
    openNormalChest() {
        //this.close()
        this.chestContainer.visible = false;
        this.openChestContainer.visible = true;

    }
    openVideoChest() {


        window.DO_REWARD(() => {
            this.confirmCallback(this.totalShards);
            this.close()
        })
        // this.chestContainer.visible = false;
        // this.openChestContainer.visible = true;
        // this.updatePrizes(0)
        
    }
    updatePrizes(total) {
        for (let index = 0; index < this.prizes.length; index++) {
            let prize = this.prizes[index]
            prize.visible = false;
        }
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
        this.chest2.scale.set(Math.sin(this.readySin) * 0.05 + 0.95 + 0.8)

        this.shine.x = this.chest2.x
        this.shine.y = this.chest2.y
        this.shine.rotation += delta * 5
        this.shine.rotation %= Math.PI * 2

        this.shinePrize.rotation = this.shine.rotation
    }
    show(param) {
        this.totalShards = param.shards
        this.visible = true;
        this.textBox.updateText(window.localizationManager.getLabel('sell-popup')+'\n'+utils.formatPointsLabel(param.shards)+" Shards");
        this.textBoxPrize.label.style.fontSize = 22
        this.textBoxPrize.label.style.fill = 0xffffff
        this.textBoxPrize.label.style.stroke = 0xad07fb
        this.textBoxPrize.label.style.strokeThickness = 6
        this.textBoxPrize.updateText('+'+utils.formatPointsLabel(param.shards)+' x '+window.localizationManager.getLabel('sell-popup-damage')+'\n'+'+'+utils.formatPointsLabel(param.shards)+' x '+window.localizationManager.getLabel('sell-popup-damage'))

        //this.textBoxPrize.label.style.align = 'left'
        this.textBoxPrize.background.alpha = 0
        this.textBoxPrize.x = - this.textBoxPrize.width / 2
        this.textBoxPrize.y = this.plusIcons.y + 80 + this.textBoxPrize.height
        this.isShowing = true;
        this.textBox.x = -this.textBox.width/2
        this.textBox.y = -this.textBox.height/2 - 10
        this.container.visible = true;
        this.background.visible = true;
        this.chestContainer.visible = true;
        this.openChestContainer.visible = false;
        this.toRemove = false;
        this.onShow.dispatch(this);

        if (param) {
            this.confirmCallback = param.onConfirm;
            this.cancelCallback = param.onCancel;
        } else {
            this.confirmCallback = null;
            this.cancelCallback = null;
        }
        
        

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
        // this.hide();
    }
    close() {
        this.onClose.dispatch(this);
        this.hide();
    }
}