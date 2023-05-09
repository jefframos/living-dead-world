import CardView from "./CardView";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../../core/view/GameView";
import InteractableView from "../../view/card/InteractableView";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";
import signals from "signals";

export default class CardPlacementSystem {
    constructor(deckView, cardPlacementView) {
        this.deckView = deckView;

        this.deckView.onConfirmLoudout.add(this.onCardEquipped.bind(this))
        this.cardPlacementView = cardPlacementView;
        this.enabled = false;
        this.player = null;

        this.onHide = new signals.Signal();

    }
    build() {

    }
    onCardEquipped(cardData) {
        //let currentID = 0;
        // this.player.activeWeapons.forEach(element => {
        //     if (element.stackWeapons.length >= 3) {
        //         currentID++;
        //     }
        // });
        // this.player.addWeaponData(EntityBuilder.instance.weaponsData[cardData.id], currentID);
        this.deckView.setActive(false)
        this.hide();
    }
    setPlayer(player) {
        this.player = player;
        this.deckView.setPlayer(this.player)
    }
    setWeapons(weapons) {
        this.weapons = weapons;

    }
    show() {
        this.enabled = true;

        this.currentData = Utils.cloneArray(GameStaticData.instance.getAllCards());

        this.currentData.push({
            id: this.player.sessionData.mainWeapon.id,
            entityData: {
                type: 'Weapon'
            },
            weaponId: this.player.sessionData.mainWeapon.id,
            starter:true
        })

        Utils.shuffle(this.currentData)

        let starters = [];

        
        for (let index = this.currentData.length - 1; index >= 0; index--) {
            if (this.currentData[index].starter) {
                starters.push(this.currentData[index]);
            }
            if (this.currentData[index] && !this.currentData[index].enabled) {
                this.currentData.splice(index, 1);
            }
        }
        // starters.unshift(GameStaticData.instance.getDataById('cards','cards', 'ORBIT_CARD'))
        // starters.unshift(GameStaticData.instance.getDataById('cards','cards', "AMOUNT_MODIFIER"))
        // console.log(this.player.sessionData, starters)
        //this.deckView.buildCards(this.currentData)
        this.deckView.buildCards(starters)

        this.deckView.setActive(true)
        this.cardPlacementView.setActive(true)
    }
    hide() {
        this.enabled = false;

        this.deckView.setActive(false)
        this.cardPlacementView.setActive(false)

        this.onHide.dispatch();
    }
    update(delta, unscaleDelta) {
        this.gameView.view.x = Utils.lerp(this.gameView.view.x, -this.gameView.view.width / 2, 0.1);
    }
    disable() {
        super.disable();
        this.gameView.view.visible = false;
    }

    enable() {
        super.enable();
        this.gameView.view.visible = true;
    }
}