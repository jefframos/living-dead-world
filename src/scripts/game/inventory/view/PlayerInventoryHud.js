import * as PIXI from 'pixi.js';

import AttributesContainer from '../../components/ui/loadout/AttributesContainer';
import Game from '../../../Game';
import GameObject from '../../core/gameObject/GameObject';
import GameStaticData from "../../data/GameStaticData";
import GameView from '../../core/view/GameView';
import LevelManager from '../../manager/LevelManager';
import LevelUpBar from '../../components/ui/progressBar/LevelUpBar';
import PlayerGameplayHud from '../../components/ui/PlayerGameplayHud';
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


        this.zero = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(0, 0, 50)
        // this.gameView.view.addChild(this.zero)
        this.darkBlur = new PIXI.Sprite.from('bigblur')
        this.gameView.view.addChild(this.darkBlur)
        this.darkBlur.anchor.set(0.5)
        this.darkBlur.width = 500
        this.darkBlur.height = 400
        this.darkBlur.x = 70
        this.darkBlur.y = 50
        this.darkBlur.tint = 0x171C21;
        this.baseBarView = new LevelUpBar()
        this.gameView.view.addChild(this.baseBarView)
        this.playerHud = new PlayerGameplayHud();
        this.playerHud.onOpenMenu.add(() => {
            if (Game.Debug.debug) {

                this.player.die()
            }
        })
        this.gameView.view.addChild(this.playerHud)
        this.baseBarView.build(0)
        this.baseBarView.forceUpdateNormal(0);

        this.text = new PIXI.Text('Level 1', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.text)
        this.text.style.fontSize = 24
        this.text.x = 50
        this.text.y = 15
        this.timer = new PIXI.Text('', window.LABELS.LABEL1)
        this.gameView.view.addChild(this.timer)
        this.timer.style.fontSize = 24
        this.timer.x = 200

        this.labelsInfoContainer = new PIXI.Container();
        if (Game.Debug.debug || Game.Debug.stats) {

            this.gameView.view.addChild(this.labelsInfoContainer)
        }

        this.attributesDebugList = new UIList();
        this.attributesDebugList.w = 1
        this.attributesDebugList.h = 50
        this.labelsInfoContainer.addChild(this.attributesDebugList)

        this.playerAttributesLabel = new PIXI.Text('', window.LABELS.LABEL1)
        //this.attributesDebugList.addElement(this.playerAttributesLabel)
        this.playerAttributesLabel.style.fontSize = 12
        this.playerAttributesLabel.style.align = 'left'
        this.playerAttributesLabel.x = 0
        this.playerAttributesLabel.y = 40


        this.playerAcessoriesLabel = new PIXI.Text('', window.LABELS.LABEL1)
        //this.attributesDebugList.addElement(this.playerAcessoriesLabel)
        this.playerAcessoriesLabel.style.fontSize = 12
        this.playerAcessoriesLabel.style.align = 'left'
        this.playerAcessoriesLabel.x = 0
        this.playerAcessoriesLabel.y = 40

        this.weaponAcessoriesLabel = new PIXI.Text('', window.LABELS.LABEL1)
        this.attributesDebugList.addElement(this.weaponAcessoriesLabel, { align: 0 })
        this.weaponAcessoriesLabel.style.fontSize = 12
        this.weaponAcessoriesLabel.style.align = 'left'
        this.weaponAcessoriesLabel.x = 0
        this.weaponAcessoriesLabel.y = 40

        this.labelsInfoContainer.x = 20
        this.labelsInfoContainer.y = 170

        this.attributesDebugList.updateVerticalList()

        this.tl = new PIXI.Graphics().beginFill(0xFFff00).drawCircle(0, 0, 50)
        this.bl = new PIXI.Graphics().beginFill(0x000fff).drawCircle(0, 0, 50)
        this.br = new PIXI.Graphics().beginFill(0xFF0ff0).drawCircle(0, 0, 50)
        this.tr = new PIXI.Graphics().beginFill(0x0Ff00f).drawCircle(0, 0, 50)
        // this.gameView.view.addChild(this.tl)
        // this.gameView.view.addChild(this.tr)
        // this.gameView.view.addChild(this.bl)
        // this.gameView.view.addChild(this.br)

        this.attributesView = new AttributesContainer();
        this.gameView.view.addChild(this.attributesView)

        this.attributesView.setSize(600, 60)
        //this.attributesView.updateAttributes(this.defaultAttributes, this.atributes)

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
        this.playerHud.registerPlayer(this.player)
        this.attributesView.updateAttributes(this.player.attributes, this.player.attributes)

        setTimeout(() => {

            this.resize();
        }, 1);
    }
    resetLevelBar() {
        this.baseBarView.updateNormal(0);
    }
    showLevelUp() {
        this.baseBarView.forceUpdateNormal(1);
    }
    updateXp(xpData) {
        if (xpData.normalUntilNext < 1) {
            this.baseBarView.forceUpdateNormal(xpData.normalUntilNext);
        }
        this.text.text = 'Level ' + (xpData.currentLevel + 1) + "     " + (xpData.xp - xpData.currentLevelXP) + "/" + xpData.levelsXpDiff;
    }
    updatePlayerHealth() {
        this.updatePlayerAttributes();
        this.updatePlayerBuffs();
    }
    extraAtt(type, defaulType, round = true) {

        if (this.player.attributes[type] != this.player.attributes[defaulType]) {
            if (round) {
                return "/ (+" + Math.round(this.player.attributes[type] - this.player.attributes[defaulType]) + ")"
            } else {
                return "/ (+" + Math.round((this.player.attributes[type] - this.player.attributes[defaulType]) * 100) + "%)"

            }
        } else {
            if (!round) {
                return "%";
            }
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

        this.weaponAcessoriesLabel.text += attributes;
    }
    updatePlayerAttributes() {
        let attributes = '';
        let attributesWeapon = '';
        attributesWeapon += "HP: " + Math.round(this.player.health.currentHealth) + " / " + Math.round(this.player.attributes.health) + this.extraAtt('health', 'baseHealth') + "\n";
        attributesWeapon += "SPEED: " + Math.round(this.player.attributes.speed) + this.extraAtt('speed', 'baseSpeed') + "\n";
        attributesWeapon += "POWER: " + Math.round(this.player.attributes.power) + this.extraAtt('power', 'basePower') + "\n";
        attributesWeapon += "DEFENSE: " + Math.round(this.player.attributes.defense) + this.extraAtt('defense', 'baseDefense') + "\n";
        attributesWeapon += "RADIUS: " + Math.round(this.player.attributes.collectionRadius) + this.extraAtt('collectionRadius', 'baseCollectionRadius') + "\n";
        attributesWeapon += "SHOOT SPEED: x" + this.player.sessionData.attributesMultiplier.baseFrequency.toFixed(1) + "\n";
        attributesWeapon += "CRIT: +" + Math.round(this.player.attributes.baseCritical * 100) + this.extraAtt('critical', 'baseCritical', false) + "\n";
        attributesWeapon += "EVASION: +" + Math.round(this.player.attributes.baseEvasion * 100) + this.extraAtt('evasion', 'baseEvasion', false) + "\n";
        if (this.player.sessionData.attributesMultiplier.basePiercing) {

            attributesWeapon += "PIERCING: +" + this.player.attributes.piercing + ' (+' + this.player.sessionData.attributesMultiplier.basePiercing + ")\n";
        } else {

            attributesWeapon += "PIERCING: +" + this.player.attributes.piercing + "\n";
        }
        //this.playerAttributesLabel.text = attributes;
        this.weaponAcessoriesLabel.text = attributesWeapon;



        this.attributesView.healthDrawer.updateAttributes(this.player.attributes.health, this.player.health.currentHealth)
    }
    updatePlayerEquip(player) {

        this.updatePlayerAttributes();
        this.updatePlayerBuffs();

        this.attributesView.updateAttributes(this.player.attributes, this.player.attributes)


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
        if (LevelManager.instance.gameplayTime > 0) {
            this.timer.text = Utils.floatToTime(Math.floor(LevelManager.instance.gameplayTime));
        } else {
            this.timer.text = '00:00'
        }

        this.timer.x = Game.Borders.width / 2 - this.timer.width / 2
        this.timer.y = 35

        // this.timer.x = Game.Borders.topRight.x - this.timer.width - 20

        // if(Game.IsPortrait){

        //     this.timer.y = Game.Borders.bottomRight.y - this.timer.height - 50
        // }else{

        //     this.timer.y = Game.Borders.bottomRight.y - this.timer.height - 20
        // }



        this.attributesView.scale.set(0.75)
        this.attributesView.y = Game.Borders.bottomRight.y - this.attributesView.height - 5
        this.attributesView.x = 5


        if (this.baseBarView.maxWidth != Game.Borders.width - 100) {
            this.baseBarView.rebuild(Game.Borders.width - 100)
            this.baseBarView.x = 80
            this.baseBarView.y = 20
        }

        this.text.x = Game.Borders.width - 250
        this.text.y = 35
        this.baseBarView.update(delta)
        this.playerHud.update(delta)


        //THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var min = Math.min(Game.GlobalScale.min, 1)
        this.playerHud.scale.set(Math.max(0.85, min));

    }
    resize(res, newRes) {
        this.playerHud.resize(res, newRes);
        if (Game.IsPortrait) {
            this.attributesView.setSize((Game.Borders.bottomRight.x / this.attributesView.scale.x) - 10, 40)
        } else {
            this.attributesView.setSize(Math.min(Game.Borders.bottomRight.x / this.attributesView.scale.x - 150, 850) - 10, 40)
        }
        //this.attributesView.setSize(Math.min(1000, Game.Borders.width * Game.GlobalScale.x),50)

    }
}