import * as PIXI from 'pixi.js';

import CircleCounter from '../../ui/hudElements/CircleCounter';
import UIList from '../../ui/uiElements/UIList';
import Utils from '../../core/utils/Utils';
import utils from '../../../utils';

export default class PlayerGameplayHud extends PIXI.Container {
    constructor() {
        super();

        this.container = new PIXI.Container();
        this.addChild(this.container);


        this.lifeContainer = new PIXI.Sprite.from('player-life-container')
        this.container.addChild(this.lifeContainer);

        this.equipmentContainer = new PIXI.Container();

        this.backEquipment = new PIXI.NineSlicePlane(PIXI.Texture.from('player-equipment-container'), 20, 0, 20, 0);
        this.equipmentContainer.addChild(this.backEquipment);

        this.backEquipment.width = 50
        this.equipmentList = new UIList();
        this.equipmentList.w = 50;
        this.equipmentList.h = 50;
        this.equipmentList.x = 20
        this.equipmentList.y = -5
        this.equipmentContainer.addChild(this.equipmentList);

        this.lifeContainer.addChild(this.equipmentContainer);
        this.equipmentContainer.x = 81
        this.equipmentContainer.y = 8
        this.lifeContainer.x = 80
        this.lifeContainer.y = 80


        this.lifeCounter = new CircleCounter(77, 50)
        this.lifeContainer.addChild(this.lifeCounter)
        this.lifeCounter.build(0xFF00DD, 0xff0000)
        this.lifeCounter.update(0.75)
        this.lifeCounter.rotation = Math.PI
        this.lifeCounter.x = 7
        this.lifeCounter.y = 7

        this.lifebarDetail = new PIXI.Sprite.from('lifebar-front')
        this.lifeContainer.addChild(this.lifebarDetail)
        this.lifebarDetail.x = 2
        this.lifebarDetail.y = 2


        this.playerFaceContainer = new PIXI.Sprite.from('player-face-container')
        this.container.addChild(this.playerFaceContainer);

        this.playerFaceMask = new PIXI.Sprite.from('player-face-mask')
        this.container.addChild(this.playerFaceMask);
        this.playerFaceMask.x = 12
        this.playerFaceMask.y = 12

        this.playerFace = new PIXI.Sprite()
        this.playerFace.anchor.set(0.5);
        this.playerFace.scale.set(1.25)
        this.playerFace.x = this.playerFaceContainer.width / 2
        this.playerFace.y = this.playerFaceContainer.height / 2 + 10
        this.addChild(this.playerFace);

        this.playerFace.mask = this.playerFaceMask
    }
    registerPlayer(player) {
        this.player = player;
        setTimeout(() => {
            this.playerFace.texture = player.playerView.staticTexture
        }, 10);

        this.player.onUpdateEquipment.add(this.updatePlayerEquip.bind(this));
        this.player.health.healthUpdated.add(this.updatePlayerHealth.bind(this))
    }
    updatePlayerEquip(player) {
        this.equipmentList.removeAllElements();
        this.equipmentList.w = 50;
        player.activeWeapons.forEach(element => {
            if (element) {
                this.equipmentList.w += 40;
                this.equipmentList.h = 50;
                let icon = new PIXI.Sprite.from(element.stackWeapons[0].ingameViewDataStatic.ingameIcon)
                Utils.scaleToFit(icon, 30)
                icon.rotation = Math.PI / 4
                icon.fitHeight = 1
                this.equipmentList.addElement(icon)
            }
        });

        this.equipmentList.updateHorizontalList()
        this.backEquipment.width = this.equipmentList.w
    }
    updatePlayerHealth(delta) {

        this.lifeCounter.update(0.75 + (1 - this.player.health.normal) * 0.25);
    }
    update(delta) {
        if (!this.player) {
            return;
        }

    }
}