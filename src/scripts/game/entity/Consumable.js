import * as PIXI from 'pixi.js';

import Collectable from './Collectable';
import EffectsManager from '../manager/EffectsManager';
import GameData from '../data/GameData';
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import LevelManager from '../manager/LevelManager';
import Player from './Player';
import RenderModule from "../core/modules/RenderModule";
import UIUtils from '../utils/UIUtils';
import Utils from '../core/utils/Utils';
import Vector3 from '../core/gameObject/Vector3';

export default class Consumable extends Collectable {
    static Type = {
        Magnet: 1,
        Coin: 2,
        Chest: 3,
        Heal: 4,
        Bomb: 5
    }
    constructor() {
        super();
    }
    setType(value) {
        this.type = value;
        switch (value) {
            case Consumable.Type.Magnet:
                this.gameView.view.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('magnet'))

                break;
            case Consumable.Type.Coin:
                this.gameView.view.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('softCurrency'))

                break;
            case Consumable.Type.Chest:

                break;
            case Consumable.Type.Heal:
                this.gameView.view.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('heal'))

                break;
            case Consumable.Type.Bomb:
                this.gameView.view.texture = PIXI.Texture.from(UIUtils.getIconUIIcon('bomb'))

                break;
        }

        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, 30))

    }
    setCollectableTexture() {
    }
    collectCallback() {

        switch (this.type) {
            case Consumable.Type.Magnet:
                LevelManager.instance.collectAllPickups();
                break;
            case Consumable.Type.Coin:
                const value = Math.round(Math.random() * 20 + 10);
                GameData.instance.addSoftCurrency(value);
                LevelManager.instance.collectCoins(value);
                EffectsManager.instance.popCoin(this, value)
                break;
            case Consumable.Type.Chest:

                break;
            case Consumable.Type.Heal:
                this.player.itemHeal();

                break;
            case Consumable.Type.Bomb:
                this.player.explodeAround();
                break;
        }
    }
}