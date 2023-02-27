import * as PIXI from 'pixi.js';

import PlayerInventorySlotEquipView from './PlayerInventorySlotEquipView';
import UIList from '../../ui/uiElements/UIList';

export default class PlayerInventoryHud extends PIXI.Container {
    constructor() {
        super()

        this.weaponGrid = [];

        for (let index = 0; index < 5; index++) {
            let list = new UIList();
            list.w = 500;
            list.h = 100;

            this.weaponGrid.push(list)
            this.addChild(list)

        }


        this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 50)
        // this.addChild(this.zero)
    }

    registerPlayer(player) {
        this.player = player;
        this.player.onUpdateEquipment.add(this.updatePlayerEquip.bind(this));
    }
    updatePlayerEquip(player) {
        if (!player.activeWeapons.length) {
            this.weaponGrid.forEach(element => {
                element.removeAllElements();
            });
        }
        for (let index = 0; index < player.activeWeapons.length; index++) {

            const element = player.activeWeapons[index];

            
            this.weaponGrid[index].removeAllElements();
            
            this.weaponGrid[index].h = 0;
            
            if(!element) continue;
            if(element.stackWeapons.length > 0){
                this.addLine(element.stackWeapons[0], true, this.weaponGrid[index])                
            }
            
            this.weaponGrid[index].x = index * 200
            this.weaponGrid[index].updateVerticalList();
        }
    }
    addLine(weapon, isMaster, list) {
        let line = new PlayerInventorySlotEquipView();
        line.registerItem(weapon, isMaster);
        line.anchorX = 0

        list.addElement(line)
        list.h += 25;

        if (weapon.onDestroyWeapon.length > 0) {
            this.addLine(weapon.onDestroyWeapon[weapon.onDestroyWeapon.length - 1], false, list)
        }
    }
}