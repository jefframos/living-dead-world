import * as PIXI from 'pixi.js';

import Game from '../../../Game';
import GameObject from '../../core/gameObject/GameObject';
import GameStaticData from "../../data/GameStaticData";
import GameView from '../../core/view/GameView';
import LevelManager from '../../manager/LevelManager';
import LevelUpBar from '../../components/ui/progressBar/LevelUpBar';
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

        this.baseBarView = new LevelUpBar()
        this.gameView.view.addChild(this.baseBarView)
        this.baseBarView.build(Game.Screen.width)
        this.baseBarView.forceUpdateNormal(0);

        this.text = new PIXI.Text('Level 1', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.text)
        this.text.style.fontSize = 18
        this.text.x = 50
        this.text.y = 15
        this.timer = new PIXI.Text('', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.timer)
        this.timer.style.fontSize = 24
        this.timer.x = 200

        this.playerAttributesLabel = new PIXI.Text('', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.playerAttributesLabel)
        this.playerAttributesLabel.style.fontSize = 12
        this.playerAttributesLabel.style.align = 'left'
        this.playerAttributesLabel.x = 150
        this.playerAttributesLabel.y = 40


        this.playerAcessoriesLabel = new PIXI.Text('', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.playerAcessoriesLabel)
        this.playerAcessoriesLabel.style.fontSize = 12
        this.playerAcessoriesLabel.style.align = 'left'
        this.playerAcessoriesLabel.x = 550
        this.playerAcessoriesLabel.y = 40

        this.weaponAcessoriesLabel = new PIXI.Text('', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.weaponAcessoriesLabel)
        this.weaponAcessoriesLabel.style.fontSize = 12
        this.weaponAcessoriesLabel.style.align = 'left'
        this.weaponAcessoriesLabel.x = 350
        this.weaponAcessoriesLabel.y = 40


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
        this.gameView.view.x = 0;
        this.gameView.view.y = 0;
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
    extraAtt(type, defaulType) {

        if (this.player.attributes[type] != this.player.attributes[defaulType]) {
            return "/ (+" + Math.round(this.player.attributes[type] - this.player.attributes[defaulType]) + ")"
        } else {
            return "";
        }

    }
    updatePlayerBuffs() {
        let attributes = '';

        this.player.activeAcessories.forEach(element => {
            if (element.item && element.item.effectId) {
                attributes += element.item.entityData.name;
                let stat = GameStaticData.instance.getDataById('misc', 'buffs', element.item.effectId);
                let chance = Utils.findValueByLevel(stat.chance, element.level)
                if (chance < 1) {
                    attributes += "  " + chance * 100 + "% chance";
                } else {
                    attributes += "  " + Math.abs(Utils.findValueByLevel(stat.value, element.level) * 100) + "% - ";
                    attributes += Utils.findValueByLevel(stat.interval, element.level) + "s";
                }
                attributes += "\n";
            }
        });

        this.playerAcessoriesLabel.text = attributes;
    }
    updatePlayerAttributes() {
        let attributes = '';
        let attributesWeapon = '';
        attributes += "HP: " + Math.round(this.player.health.currentHealth) + " / " + Math.round(this.player.attributes.health) + this.extraAtt('health', 'baseHealth') + "\n";
        attributes += "SPEED: " + Math.round(this.player.attributes.speed) + this.extraAtt('speed', 'baseSpeed') + "\n";
        attributes += "POWER: " + Math.round(this.player.attributes.power) + this.extraAtt('power', 'basePower') + "\n";
        attributes += "DEFENSE: " + Math.round(this.player.attributes.defense) + this.extraAtt('defense', 'baseDefense') + "\n";
        attributesWeapon += "RADIUS: " + Math.round(this.player.attributes.collectionRadius) + this.extraAtt('collectionRadius', 'baseCollectionRadius') + "\n";
        attributesWeapon += "SHOOT SPEED: x" + this.player.sessionData.attributesMultiplier.baseFrequency.toFixed(1) + "\n";
        attributesWeapon += "AMOUNT: +" + this.player.sessionData.attributesMultiplier.baseAmount + "\n";
        attributesWeapon += "PIERCING: +" + this.player.sessionData.attributesMultiplier.basePiercing + "\n";
        this.playerAttributesLabel.text = attributes;
        this.weaponAcessoriesLabel.text = attributesWeapon;
    }
    updatePlayerEquip(player) {
        if (!player.activeWeapons.length) {
            this.weaponGrid.forEach(element => {
                element.removeAllElements();
            });
        }

        this.updatePlayerAttributes();
        this.updatePlayerBuffs();

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
        this.timer.text = Utils.floatToTime(Math.floor(LevelManager.instance.gameplayTime));

        this.timer.x = Game.Borders.topRight.x - this.timer.width - 20
        this.timer.y = Game.Borders.bottomRight.y - this.timer.height - 20


        if (this.baseBarView.maxWidth != Game.Borders.width) {
            this.baseBarView.rebuild(Game.Borders.width)
        }
        this.baseBarView.update(delta)
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