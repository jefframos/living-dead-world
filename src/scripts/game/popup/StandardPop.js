import * as PIXI from 'pixi.js';

import Signals from 'signals';
import TextBox from '../ui/TextBox';
import UIButton1 from '../ui/UIButton1';
import UILabelButton1 from '../ui/UILabelButton1';
import config from '../../config';

export default class StandardPop extends PIXI.Container {
    constructor(label, screenManager) {
        super();
        this.screenManager = screenManager;
        this.label = label;
        this.onShow = new Signals();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onClose = new Signals();

        this.container = new PIXI.Container();

        this.w = config.width * 0.9;
        this.h = config.height * 0.5;

        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5, config.width * 10, config.height * 10)
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.background.visible = false

        this.popUp = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.from(config.assets.popup.primary), 50, 100, 50, 50)
        this.popUp.width = this.w
        this.popUp.height = this.h

        config.addPaddingPopup(this.popUp)

       

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


        this.label1 = new PIXI.Text('!', LABELS.LABEL1);
        this.label2 = new PIXI.Text('!', LABELS.LABEL1);
        this.label3 = new PIXI.Text('', LABELS.LABEL1);
        this.label3.anchor.set(0.5)
        this.label3.y = 80

        this.label4 = new TextBox(15, config.assets.panel.tertiary, 28);
        this.label4.y = 80

        config.addPaddingPanel(this.label4.background)



        this.glow = new PIXI.Sprite.from('shine')
        this.container.addChild(this.glow)
        this.glow.anchor.set(0.5)
        this.glow.scale.set(3.5)
        this.glow.y = -80
        this.glow.alpha = 0.3

        this.coin1 = new PIXI.Sprite()
        this.coin2 = new PIXI.Sprite()
        this.coin1.anchor.set(0.5)
        this.coin2.anchor.set(0.5)
        this.container.addChild(this.coin1)
        this.container.addChild(this.coin2)
        this.container.addChild(this.label4)

        this.centerIcon = new PIXI.Sprite()
        this.centerIcon.anchor.set(0.5)
        this.container.addChild(this.centerIcon)


        this.coin1.addChild(this.label1)
        this.coin2.addChild(this.label2)
        this.centerIcon.addChild(this.label3)
        this.label2.style.fontSize = 24

        this.titleTextBox = new TextBox(20, config.assets.panel.tertiary, 32)

        this.container.addChild(this.titleTextBox)
        this.confirmButton = new UILabelButton1(150, 80, config.assets.button.primaryLong)
        this.confirmButton.addCenterLabel(window.localizationManager.getLabel('collect') + ' x2')
        this.confirmButton.addVideoIcon()
        this.confirmButton.pivot.x = 75
        this.confirmButton.pivot.y = 40
        
        this.container.addChild(this.confirmButton)
        this.confirmButton.x = 90
        this.confirmButton.y = this.h / 2 - 80
        this.confirmButton.onClick.add(() => {
            if (this.confirmCallback) {
                this.confirmCallback()
                this.confirm()
            }
        })
        this.cancelButton = new UILabelButton1(130, 70, config.assets.button.greyLong)
        this.cancelButton.pivot.x = 130 / 2
        this.cancelButton.addCenterLabel(window.localizationManager.getLabel('collect'))

        this.cancelButton.pivot.y = 35
        this.container.addChild(this.cancelButton)
        this.cancelButton.x = -90
        this.cancelButton.y = this.h / 2 - 80

        this.cancelButton.onClick.add(() => {
            if (this.cancelCallback) {
                this.cancelCallback()
                //this.cancelButton()
                this.hide();

            }
        })

        this.coin1.x = this.cancelButton.x
        this.coin2.x = this.confirmButton.x
        this.coin1.y = this.cancelButton.y - 260
        this.coin2.y = this.coin1.y - 30

        this.container.visible = false;

        this.readySin = 0;


        this.closePopUp = new UIButton1(0xFFffff, window.TILE_ASSSETS_POOL['image-X'], 0xFFffff, 70, 70, config.assets.button.warningSquare)
        this.closePopUp.updateIconScale(0.5)
        this.container.addChild(this.closePopUp)
        this.closePopUp.x = this.w / 2 
        this.closePopUp.y = -this.h / 2 
        this.closePopUp.onClick.add(() => {
            this.close()
        })

       
    }
    update(delta) {
        this.readySin += delta * 8
        this.confirmButton.scale.set(Math.sin(this.readySin) * 0.05 + 0.95)

        this.glow.rotation += delta * 2
        this.glow.rotation %= Math.PI * 2
    }
    show(param, visuals) {

        SOUND_MANAGER.play('Synth-Appear-01', 0.1)

        this.visible = true;
        this.popUp.scale.set(1)
        this.container.alpha = 1
        this.background.alpha = 0.25


        this.isShowing = true;
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

        this.confirmButton.videoIcon.visible = param.video;

        if (param.value1 == 0) {
            this.cancelButton.visible = false
            this.coin1.visible = false
            this.coin2.visible = true
            this.closePopUp.visible = true
            this.coin2.x = 0
            this.coin2.y = this.coin1.y - 80
            this.confirmButton.x = 0
        } else {

            this.cancelButton.visible = true
            this.coin1.visible = true
            this.coin2.visible = true

            this.closePopUp.visible = false

            this.confirmButton.x = 90
            this.cancelButton.x = -90

            this.coin1.x = this.cancelButton.x
            this.coin2.x = this.confirmButton.x
            this.coin1.y = this.cancelButton.y -300
            this.coin2.y = this.coin1.y - 30
        }
        if (param.hideAll) {
            this.coin1.visible = false
            this.coin2.visible = false
        }
        if (param.popUpType) {
            this.popUp.texture = PIXI.Texture.from(param.popUpType)
        } else {
            this.popUp.texture = PIXI.Texture.from(config.assets.popup.primary)
        }
        this.titleTextBox.background.texture = this.popUp.texture

        this.label4.visible = false;
        if (param.mainIcon) {

            this.label3.text = ''//param.mainLabel

            this.label4.updateText(param.mainLabel)
            this.label4.visible = true;

            this.centerIcon.texture = PIXI.Texture.from(param.mainIcon)
            this.centerIcon.visible = true;
            if (param.mainIconHeight) {
                this.centerIcon.scale.set(param.mainIconHeight / this.centerIcon.height * this.centerIcon.scale.y)
            } else {
                this.centerIcon.scale.set(this.h / this.centerIcon.height * this.centerIcon.scale.y * 0.3)
            }
            this.centerIcon.y = -100

            if (!param.onConfirm) {
                this.coin1.visible = false;
            }
            if (!param.onCancel) {
                this.coin2.visible = false;
            }
        } else {
            this.centerIcon.visible = false;
        }
        if (param.mainLabel2) {
            this.label4.updateText(param.mainLabel2)
            this.label4.visible = true;
            this.label3.video = false;
        } else {
            this.label4.updateText('')
            this.label4.visible = false;
        }

        this.confirmButton.addCenterLabel(param.confirmLabel, 0xFFFFFF, 2)
        this.cancelButton.addCenterLabel(param.cancelLabel)
        this.label1.text = param.value1
        this.label1.pivot.x = this.label1.width / 2
        this.label1.y = 50

        this.label2.text = param.value2
        this.label2.pivot.x = this.label2.width / 2
        this.label2.y = 50


        if (param.title) {
            this.titleTextBox.updateText(param.title)
            this.titleTextBox.visible = true
        } else {
            this.titleTextBox.visible = false
        }

        this.titleTextBox.x = 0
        this.titleTextBox.y = -this.h / 2

        if (visuals) {

            this.coin2.texture = new PIXI.Texture.from(visuals.coin+'l')

            if (param.value1Icon) {
                this.coin1.texture = PIXI.Texture.from(param.value1Icon)
            } else {
                this.coin1.texture = new PIXI.Texture.from(visuals.coin+'l')
            }

            if (param.value2Icon) {
                this.coin2.texture = PIXI.Texture.from(param.value2Icon)
            } else {
                this.coin2.texture = new PIXI.Texture.from(visuals.coin+'l')
            }

            if (param.value2IconHeight) {
                let scl = Math.min((param.value2IconHeight + 20) / this.coin2.height * this.coin2.scale.x, param.value2IconHeight / this.coin2.width * this.coin2.scale.x)
                this.coin2.scale.set(scl)
                this.coin2.y = this.coin1.y + 15
            } else {
                this.coin2.scale.set(this.coin1.scale.x * 1.3)
            }
        }
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
                    //this.toRemove = true

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