import * as PIXI from 'pixi.js';

import Game from '../../../Game';
import LocalizationManager from '../../LocalizationManager';
import MainScreenModal from './MainScreenModal';
import UIList from '../../ui/uiElements/UIList';
import UIUtils from '../../utils/UIUtils';
import signals from 'signals';

export default class InGamePopupMenu extends MainScreenModal {
    constructor() {
        super();


        this.addScreenBlocker();



        this.topBlocker = new PIXI.Sprite.from('base-gradient');
        //this.topBlocker = new PIXI.Sprite.from('square_button_0001');
        //this.topBlocker.tint = 0x851F88;
        this.topBlocker.tint = 0;
        this.topBlocker.scale.y = -1
        this.addChildAt(this.topBlocker, 0);


        this.blocker.alpha = 0.25;
        this.blocker.tint = 0;
        //this.blocker.tint = 0x00ffbf;
        this.prizesContainer = new PIXI.Container();
        this.container.addChild(this.prizesContainer);


        this.blackout = UIUtils.getRect(0, 100, 100)
        this.blackout.alpha = 0.75
        //this.addChildAt(this.blackout, 0);

        this.backContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0008'), 20,20,20,20)
        this.container.addChild(this.backContainer);
        this.backContainer.width = 400
        this.backContainer.height = 560

        this.buttonList = new UIList();
        this.buttonList.w = 250
        this.container.addChild(this.buttonList);

        this.onQuitGame = new signals.Signal();
        const buttonsData = [
            {
                label: LocalizationManager.instance.getLabel('CONTINUE'),
                texture: 'square_button_0002',
                callback: () => {
                    this.hide()
                },
                sound: 'Synth-Appear-01'
            },
            {
                label: LocalizationManager.instance.getLabel('QUIT'),
                texture: 'square_button_0011',
                callback: () => {
                    this.hide()
                    this.onQuitGame.dispatch();
                },
                sound: 'Synth-Appear-01'
            }
        ]

        buttonsData.forEach(element => {

            const button = UIUtils.getPrimaryButton(element.callback, element.label)
            button.updateBackTexture(element.texture)
            this.buttonList.addElement(button);
            button.buttonSound = element.sound
            button.resize(this.buttonList.w, 70)

        });

        this.visible = false;

        this.buttonList.h = this.buttonList.elementsList.length * 90
        this.buttonList.updateVerticalList();

        this.weaponAcessoriesLabel = new PIXI.Text('', window.LABELS.LABEL1)
        this.addChild(this.weaponAcessoriesLabel)
        this.weaponAcessoriesLabel.scale.set(0.7)
        this.weaponAcessoriesLabel.style.fontSize = 24
        this.weaponAcessoriesLabel.style.align = 'center'
        this.weaponAcessoriesLabel.anchor.set(0.5)

    }
    addBackgroundShape() {
        this.modalTexture = null;
        super.addBackgroundShape();

    }
    updateAttributesLabel(label){
        this.weaponAcessoriesLabel.text = 'STATS\n\n'+label
    }
    recenterContainer() {
        this.container.pivot.x = this.container.width / 2
        this.container.x = Game.Borders.width / 2

        this.container.pivot.y = this.container.height / 2
        this.container.y = Game.Borders.height / 2

    }
    resize(res, newRes) {

        if (this.infoBackContainer) {

            this.infoBackContainer.width = 550
            this.infoBackContainer.height = 500
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


        this.buttonList.x = -this.buttonList.w / 2 - this.buttonList.width / 2 + this.backContainer.width / 2
        this.buttonList.y = this.backContainer.height - 200

        this.weaponAcessoriesLabel.x = Game.Borders.width / 2
        this.weaponAcessoriesLabel.y = Game.Borders.height / 2 - 110

        //this.recenterContainer();
    }

    update(delta) {
        if (!this.isOpen) {
            return;
        }
        super.update(delta)



    }
}