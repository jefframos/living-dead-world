import CardView from "../../view/card/CardView";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
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

        for (let i = 0; i < 4; i++) {
            let a = new CardView();
            this.gameView.view.addChild(a);
            a.x = 100 * i
            this.handCards.push(a)
        }

        //this.gameView.view.x = Game.Screen.width / 2
        this.gameView.view.y = Game.Screen.height / 2 - 100

        InteractableView.addMouseEnter(this.gameView.view, () => { console.log("test") })
        InteractableView.addMouseOut(this.gameView.view, () => { console.log("test2") })


    }
    build() {

    }
    update() {
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