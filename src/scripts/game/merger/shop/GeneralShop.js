import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import { utils } from 'pixi.js/lib/core';
import EntityShop from './EntityShop';

export default class GeneralShop extends EntityShop {
    constructor(mainSystem, size, border = 0) {
        super(mainSystem, size, border = 0)

        this.toggles.removeButton(2)
    }

    confirmItemShop(item) {
        window.gameModifyers.saveModifyers(item.rawData.modifyer, item.currentLevel, item.getRawResources())
        // this.mainSystem.forEach(resourceSystem => {
        //     resourceSystem.findUpgrade(item)
        // });

        // COOKIE_MANAGER.addMergePieceUpgrade(item);

        this.onPurchase.dispatch(item);

    }
    show() {
        this.title.text = window.localizationManager.getLabel('upgrades')       
        this.visible = true;
        this.currentItens.forEach(element => { 
            element.updatePreviewValue(this.toggles.currentActiveValue)
        });
        this.posShow();
    }
    addItems(items, skipCheck = false) {
        super.addItems(items, true);
    }
}