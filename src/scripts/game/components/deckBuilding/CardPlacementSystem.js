import CardView from "./CardView";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../../core/view/GameView";
import InteractableView from "../../view/card/InteractableView";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";
import WeaponBuilder from "../../screen/WeaponBuilder";
import signals from "signals";

export default class CardPlacementSystem {
    constructor(deckView, cardPlacementView) {
        this.deckView = deckView;

        this.deckView.onCardClicked.add(this.onCardEquipped.bind(this))
        this.cardPlacementView = cardPlacementView;
        this.enabled = false;
        this.player = null;

        this.onHide = new signals.Signal();
        
    }
    build() {

    }
    onCardEquipped(cardData){
        let currentID = 0;
        this.player.activeWeapons.forEach(element => {
            if(element.stackWeapons.length >= 3){
                currentID++;
            }
        });
        this.player.addWeaponData(WeaponBuilder.instance.weaponsData[cardData.id],currentID);
        this.hide();
    }
    setPlayer(player){
        this.player = player;
    }
    setWeapons(weapons){
        this.weapons = weapons;

    }
    show() {
        this.enabled = true;

        this.currentData = Utils.cloneArray(GameStaticData.instance.getAllCards());
        Utils.shuffle(this.currentData)
        this.deckView.buildCards(this.currentData)        
        
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