import * as PIXI from 'pixi.js';

import PlayerInventorySlotEquipView from './PlayerInventorySlotEquipView';
import UIList from '../../ui/uiElements/UIList';

export default class PlayerInventoryHud extends PIXI.Container {
    constructor() {
        super()

        this.equippedItemsList = new UIList();
        this.equippedItemsList.w = 500;
        this.equippedItemsList.h = 100;


        this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 50)
        this.addChild(this.zero)
        this.addChild(this.equippedItemsList)
    }

    registerPlayer(player) {
        this.player = player;
        this.player.onUpdateEquipment.addOnce(this.updatePlayerEquip.bind(this));
    }
    updatePlayerEquip(player) {

        this.equippedItemsList.removeAllElements();
        this.equippedItemsList.h = 50;
        player.activeWeapons.forEach(element => {
            this.addLine(element.weaponData, true)
        });

        this.equippedItemsList.updateVerticalList();
    }
    addLine(weapon, isMaster) {
        let line = new PlayerInventorySlotEquipView();
        line.registerItem(weapon, isMaster);
        line.anchorX = 0
        this.equippedItemsList.addElement(line)
        this.equippedItemsList.h += 50;

        if(weapon.onDestroyWeapon){
            this.addLine(weapon.onDestroyWeapon, false)
        }
    }
}