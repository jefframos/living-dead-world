import * as PIXI from 'pixi.js';

import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import UILabelButton1 from '../ui/UILabelButton1';
import config from '../../config';
import SinglePrizeContainer from '../ui/SinglePrizeContainer';
import TextBox from '../ui/TextBox';

export default class BonusConfirmation extends PIXI.Container {
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

        this.w = config.width * 0.85;
        this.h = 300;

        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5, config.width * 10, config.height * 10)
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('mousedown', this.close.bind(this)).on('touchstart', this.close.bind(this));
        this.background.visible = false

        this.popUp = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from('oct-no-pattern-cyan'), 30, 30, 30, 30)
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




        this.textBox = new TextBox(20);
        this.textBox.updateText('Thanks for helping us\nChoose your prize')
        this.textBox.interactive = true;
        this.textBox.buttonMode = true;
        this.textBox.on('mousedown', this.close.bind(this)).on('touchstart', this.close.bind(this));

        this.chestContainer.addChild(this.textBox)

        this.icon = new PIXI.Sprite.from('drill')
        this.icon.anchor.set(1, 0)
        this.icon.x = this.w / 2 - 20
        this.icon.y = -this.h / 2 + 20
        this.icon.scale.set(this.h / this.icon.height * this.icon.scale.x)
        this.chestContainer.addChild(this.icon)

        this.container.visible = false;

        this.readySin = 0;

        this.collectButton = new UILabelButton1(130, 60)
        this.collectButton.addVideoIcon()
        this.collectButton.addCenterLabel(window.localizationManager.getLabel('activate'), true)
        this.chestContainer.addChild(this.collectButton)
        this.collectButton.pivot.x = this.collectButton.width / 2;
        this.collectButton.y = 60
        this.collectButton.onClick.add(() => {
            this.confirmCallback();
            this.close()
        })

        this.openShop = new UIButton1(0xFFffff, window.TILE_ASSSETS_POOL['image-X'], 0xFFffff, 60, 60, 'boss-button')
        this.openShop.updateIconScale(0.5)
        this.chestContainer.addChild(this.openShop)
        this.openShop.x = -this.w / 2 + 50
        this.openShop.y = -this.h / 2 + 50
        this.openShop.onClick.add(() => {
            this.close()
        })


        this.labelTitle = new PIXI.Text('Video Reward', LABELS.LABEL1);
        this.labelTitle.style.fontSize = 32
        this.labelTitle.style.stroke = 0
        this.labelTitle.style.strokeThickness = 6
        this.labelTitle.x = - this.labelTitle.width / 2
        this.labelTitle.y = -this.h / 2 + 30
        this.chestContainer.addChild(this.labelTitle)

        this.isShowing = false;
        window.onSpacePressed.add(() => {
            if (!this.isShowing) {
                return;
            }
            if (this.chestContainer.visible) {

                this.openVideoChest();
            }
        })


        window.onEscPressed.add(() => {
            if (!this.isShowing) {
                return;
            }
            if (this.chestContainer.visible) {

                this.close()
            }
        })
    }
    openNormalChest() {
        //this.close()
        this.chestContainer.visible = false;
        this.openChestContainer.visible = true;

    }
    openVideoChest() {


        window.DO_REWARD(() => {
            this.confirmCallback();
            this.close()
        })
        // this.chestContainer.visible = false;
        // this.openChestContainer.visible = true;
        // this.updatePrizes(0)

    }


    update(delta) {
        this.readySin += delta * 8
    }
    show(param) {

        this.labelTitle.text = param.shortDescription + ' '+window.localizationManager.getLabel('bonus');
        this.labelTitle.x = - this.labelTitle.width / 2
        this.visible = true;
        this.textBox.updateText(param.description);
        this.icon.texture = param.texture;
        this.icon.scale.set((60) / this.icon.height * this.icon.scale.x)

        this.isShowing = true;
        this.textBox.x = -this.textBox.width / 2
        this.textBox.y = -this.textBox.height / 2
        this.container.visible = true;
        this.background.visible = true;


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