import CardView from "./CardView";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../../core/view/GameView";
import InteractableView from "../../view/card/InteractableView";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";
import signals from "signals";

export default class DeckView extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.UILayer;
        this.gameView.view = new PIXI.Container();


        this.handCards = [];



        //this.gameView.view.x = Game.Screen.width / 2
        this.gameView.view.y = Game.Screen.height / 2 - 100

        // InteractableView.addMouseEnter(this.gameView.view, () => { console.log("test") })
        // InteractableView.addMouseOut(this.gameView.view, () => { console.log("test2") })
        this.onCardClicked = new signals.Signal();

    }
    buildCards(data) {

        for (let i = this.handCards.length - 1; i >= 0; i--) {
            if (this.handCards[i].parent) {
                this.handCards[i].parent.removeChild(this.handCards[i]);
            }
        }
        this.handCards = [];
        for (let i = 0; i < 3; i++) {
            let dt = GameStaticData.instance.getDataById('weapons', 'main', data[i].weaponId);
            let a = new CardView();
            this.gameView.view.addChild(a);
            a.x = 100 * i
            a.onCardClicked.add((card) => {
                this.onCardClicked.dispatch(card.cardData)
                card.visible = false;
                this.handCards = this.handCards.filter(item => item !== card);
            })
            this.handCards.push(a)
            a.setData(dt);
        }
    }
    build() {

    }

    update(delta, unscaleDelta) {
        this.gameView.view.x = Utils.lerp(this.gameView.view.x, -this.gameView.view.width / 2, 0.1);

        for (let index = this.handCards.length - 1; index >= 0; index--) {
            const element = this.handCards[index];
            element.update(unscaleDelta)

            element.x = Utils.lerp(element.x, 100 * index, 0.5)
        }
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