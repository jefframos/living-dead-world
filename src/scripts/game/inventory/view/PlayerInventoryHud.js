import * as PIXI from 'pixi.js';

import BaseBarView from '../../components/ui/progressBar/BaseBarView';
import Game from '../../../Game';
import GameObject from '../../core/gameObject/GameObject';
import GameView from '../../core/view/GameView';
import PlayerInventorySlotEquipView from './PlayerInventorySlotEquipView';
import RenderModule from '../../core/modules/RenderModule';
import UIList from '../../ui/uiElements/UIList';

export default class PlayerInventoryHud extends GameObject {
    constructor() {
        super()

        this.gameView = new GameView(this)
        this.gameView.layer = RenderModule.UILayer;
        this.gameView.view = new PIXI.Container();
        this.weaponGrid = [];

        for (let index = 0; index < 5; index++) {
            let list = new UIList();
            list.w = 500;
            list.h = 100;

            this.weaponGrid.push(list)
            this.gameView.view.addChild(list)

            list.y = 40

        }


        this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 50)
        // this.gameView.view.addChild(this.zero)

        this.baseBarView = new BaseBarView()
        this.gameView.view.addChild(this.baseBarView)
        this.baseBarView.build(Game.Screen.width, 30, 4)
        this.baseBarView.setColors(0xFF00FF, 0x00FFFF)
        this.baseBarView.forceUpdateNormal(0);

        this.text = new PIXI.Text('Level 1', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.text)
        this.text.style.fontSize = 24
        this.text.x = 20
    }
    build() {
        super.build();

        this.gameView.view.x = -Game.Screen.width / 2
        this.gameView.view.y = -Game.Screen.height / 2
    }
    registerPlayer(player) {
        this.player = player;
        this.text.text = 'Level 1';
        this.player.onUpdateEquipment.add(this.updatePlayerEquip.bind(this));
        this.player.sessionData.xpUpdated.add(this.updateXp.bind(this))
        this.player.sessionData.addXp(0)
    }
    updateXp(xpData) {
        this.baseBarView.forceUpdateNormal(xpData.normalUntilNext);
        this.text.text = 'Level ' + (xpData.currentLevel + 1);
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

            if (!element) continue;
            if (element.stackWeapons.length > 0) {
                this.addLine(element.stackWeapons[0], true, this.weaponGrid[index])
            }

            this.weaponGrid[index].x = index * 35 + 20
            this.weaponGrid[index].updateVerticalList();
        }
    }
    addLine(weapon, isMaster, list) {
        let line = new PlayerInventorySlotEquipView();
        line.registerItem(weapon, isMaster);
        line.anchorX = 0

        list.addElement(line)
        list.h += 35;

        if (weapon.onDestroyWeapon.length > 0) {
            this.addLine(weapon.onDestroyWeapon[weapon.onDestroyWeapon.length - 1], false, list)
        }
    }
}