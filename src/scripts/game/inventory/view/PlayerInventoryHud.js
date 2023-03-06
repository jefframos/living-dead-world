import * as PIXI from 'pixi.js';

import BaseBarView from '../../components/ui/progressBar/BaseBarView';
import Game from '../../../Game';
import GameManager from '../../manager/GameManager';
import GameObject from '../../core/gameObject/GameObject';
import GameView from '../../core/view/GameView';
import PlayerInventorySlotEquipView from './PlayerInventorySlotEquipView';
import RenderModule from '../../core/modules/RenderModule';
import UIList from '../../ui/uiElements/UIList';
import Utils from '../../core/utils/Utils';

export default class PlayerInventoryHud extends GameObject {
    constructor() {
        super()

        this.gameView = new GameView(this)
        this.gameView.layer = RenderModule.UILayerOverlay;
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

        this.timer = new PIXI.Text('', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.timer)
        this.timer.style.fontSize = 24
        this.timer.x = 200

        this.playerAttributes = new PIXI.Text('', window.LABELS.LABEL1)
        //this.gameView.view.addChild(this.playerAttributes)
        Game.UIOverlayContainer.addChild(this.playerAttributes)
        this.playerAttributes.style.fontSize = 12
        this.playerAttributes.style.align = 'left'
        this.playerAttributes.x = 150
        this.playerAttributes.y = 40


        this.tl = new PIXI.Graphics().beginFill(0xFFff00).drawCircle(0, 0, 50)
        this.bl = new PIXI.Graphics().beginFill(0x000fff).drawCircle(0, 0, 50)
        this.br = new PIXI.Graphics().beginFill(0xFF0ff0).drawCircle(0, 0, 50)
        this.tr = new PIXI.Graphics().beginFill(0x0Ff00f).drawCircle(0, 0, 50)
        // this.gameView.view.addChild(this.tl)
        // this.gameView.view.addChild(this.tr)
        // this.gameView.view.addChild(this.bl)
        // this.gameView.view.addChild(this.br)


    }
    build() {
        super.build();

        this.gameView.view.x = 0//-Game.Screen.width / 2
        this.gameView.view.y = 0//-Game.Screen.height / 2
    }
    registerPlayer(player) {
        this.player = player;
        this.text.text = 'Level 1';
        this.player.onUpdateEquipment.add(this.updatePlayerEquip.bind(this));
        this.player.sessionData.xpUpdated.add(this.updateXp.bind(this))
        this.player.sessionData.addXp(0)
        this.player.health.healthUpdated.add(this.updatePlayerHealth.bind(this))
    }
    updateXp(xpData) {
        this.baseBarView.forceUpdateNormal(xpData.normalUntilNext);
        this.text.text = 'Level ' + (xpData.currentLevel + 1) + "     " + (xpData.xp - xpData.currentLevelXP) + "/" + xpData.levelsXpDiff;
    }
    updatePlayerHealth() {
        this.updatePlayerAttributes();
    }
    updatePlayerAttributes() {
        let attributes = '';
        attributes += "HP: " + this.player.health.currentHealth + " / " + Math.round(this.player.attributes.health) + "\n";
        attributes += "SPEED: " + Math.round(this.player.attributes.speed) + "\n";
        attributes += "POWER: " + Math.round(this.player.attributes.power) + "\n";
        attributes += "DEFENSE: " + Math.round(this.player.attributes.defense) + "\n";
        attributes += "SHOOT SPEED: x" + this.player.sessionData.attributesMultiplier.baseFrequency.toFixed(1) + "\n";
        this.playerAttributes.text = attributes;
    }
    updatePlayerEquip(player) {
        if (!player.activeWeapons.length) {
            this.weaponGrid.forEach(element => {
                element.removeAllElements();
            });
        }

        this.updatePlayerAttributes();

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

    update(delta) {
        this.timer.text = Utils.floatToTime(Math.floor(GameManager.instance.gameplayTime));

        this.timer.x = Game.Borders.topRight.x - this.timer.width - 20
        this.timer.y = Game.Borders.bottomRight.y - this.timer.height - 20


        if(this.baseBarView.maxWidth != Game.Borders.width){
            this.baseBarView.rebuild(Game.Borders.width, 30, 4)
        }

        //debug borders
        // this.tl.x = Game.Borders.topLeft.x
        // this.tl.y = Game.Borders.topLeft.y

        // this.tr.x = Game.Borders.topRight.x
        // this.tr.y = Game.Borders.topRight.y

        // this.bl.x = Game.Borders.bottomLeft.x
        // this.bl.y = Game.Borders.bottomLeft.y

        // this.br.x = Game.Borders.bottomRight.x
        // this.br.y = Game.Borders.bottomRight.y

    }
}