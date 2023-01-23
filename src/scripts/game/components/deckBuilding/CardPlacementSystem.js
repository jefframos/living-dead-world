import CardView from "./CardView";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameView from "../../core/view/GameView";
import InteractableView from "../../view/card/InteractableView";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";
import signals from "signals";

export default class CardPlacementSystem {
    constructor(deckView, cardPlacementView) {
        this.deckView = deckView;

        this.deckView.onCardClicked.add(this.onCardEquipped.bind(this))
        this.cardPlacementView = cardPlacementView;
        this.enabled = false;
        this.player = null;
    }
    build() {

    }
    onCardEquipped(cardData){
        this.player.addWeaponData(cardData);
    }
    setPlayer(player){
        this.player = player;
    }
    setWeapons(weapons){
        this.weapons = weapons;

        this.deckView.buildCards(this.weapons.physical)        
    }
    show() {
        this.enabled = true;

        this.deckView.setActive(true)
        this.cardPlacementView.setActive(true)        
    }
    hide() {
        this.enabled = false;

        this.deckView.setActive(false)
        this.cardPlacementView.setActive(false)
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