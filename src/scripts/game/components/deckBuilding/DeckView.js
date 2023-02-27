import CardView from "./CardView";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../../core/view/GameView";
import GridSlotView from "./grid/GridSlotView";
import InputModule from "../../core/modules/InputModule";
import InteractableView from "../../view/card/InteractableView";
import Player from "../../entity/Player";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";
import WeaponBuilder from "../../screen/WeaponBuilder";
import signals from "signals";

export default class DeckView extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.UILayer;
        this.gameView.view = new PIXI.Container();


        this.handCards = [];
        this.gridArray = [];
        this.gridData = [];

        this.backShape = new PIXI.Graphics().beginFill(0xffffff).drawRect(-5000, -5000, 10000, 10000)
        this.gameView.view.addChild(this.backShape)
        this.backShape.tint = 0
        this.backShape.alpha = 0.3
        this.onCardClicked = new signals.Signal();

        this.gridContainer = new PIXI.Container();
        this.cardsContainer = new PIXI.Container();
        this.transitionContainer = new PIXI.Container();

        this.gameView.view.addChild(this.gridContainer)
        this.gameView.view.addChild(this.cardsContainer)
        this.gameView.view.addChild(this.transitionContainer)

        let gridWidth = 100
        for (var i = 0; i < 3; i++) {
            let temp = [];
            for (var j = 0; j < 3; j++) {
                let gridView = new GridSlotView();
                this.gridContainer.addChild(gridView)
                gridView.x = i * (gridWidth + 5)
                gridView.y = j * (gridWidth + 5)
                gridView.i = i
                gridView.j = j
                this.gridArray.push(gridView)
                temp.push(null);
            }
            this.gridData.push(temp);
        }

        this.gridContainer.pivot.x = this.gridContainer.width / 2
        this.gridContainer.pivot.y = this.gridContainer.height / 2

        InteractableView.addMouseUp(this.gameView.view, () => {
            if (this.slotOver) {
                this.slotOver.mouseOut();
            }
            if (!this.cardHolding) {
                this.slotOver = null;
                return;
            }
            this.cardHolding.interactive = true;
            if (this.slotOver) {
                this.slotOver.setData(this.cardHolding.cardData)
                this.cardHolding.parent.removeChild(this.cardHolding)
                this.gridData[this.slotOver.i][this.slotOver.j] = WeaponBuilder.instance.weaponsData[this.cardHolding.cardData.id];
                //Player.MainPlayer.addWeaponData(WeaponBuilder.instance.weaponsData[this.cardHolding.cardData.id], this.slotOver.i)
                Player.MainPlayer.rebuildWeaponGrid(this.gridData);
                this.cardHolding = null;

            } else {
                this.handCards.splice(this.cardHolding.id, 0, this.cardHolding);
            }
            this.cardHolding = null;
            for (let i = 0; i < this.handCards.length; i++) {
                this.handCards[i].id = i;
                this.cardsContainer.addChild(this.handCards[i]);
            }
            this.slotOver = null;
        })

        this.zero = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0, 0, 20)
        //this.gameView.view.addChild(this.zero)
    }
    start() {
        super.start();
        this.input = this.engine.findByType(InputModule)
    }
    buildCards(data) {

        for (let i = this.handCards.length - 1; i >= 0; i--) {
            if (this.handCards[i].parent) {
                this.handCards[i].parent.removeChild(this.handCards[i]);
            }
        }
        this.cardHolding = null;
        this.slotOver = null;
        this.handCards = [];
        for (let i = 0; i < 4; i++) {
            let dt = GameStaticData.instance.getDataById('weapons', 'main', data[i].weaponId);
            let a = new CardView();
            this.cardsContainer.addChild(a);
            a.x = 120 * i
            a.id = i;
            a.onCardClicked.add((card) => {
                this.onCardClicked.dispatch(card.cardData)
                card.visible = false;
                this.handCards = this.handCards.filter(item => item !== card);
            })
            a.onStartDrag.add((card) => {
                this.cardHolding = card;
                this.handCards.splice(card.id, 1);
                this.transitionContainer.addChild(card);
                this.cardHolding.interactive = false;
            })
            this.handCards.push(a)
            a.setData(dt);
        }

        this.cardsContainer.y = Game.Screen.height / 2


    }
    build() {

    }
    checkGridCollision() {
        let temp = null;
        this.gridArray.forEach(element => {
            if (this.isPointInsideAABB(this.input.localMousePosition, element)) {
                temp = element
            }
        });

        if (this.slotOver && !temp) {
            this.slotOver.mouseOut();
            this.slotOver = null;
        } if (this.slotOver && this.slotOver != temp) {
            this.slotOver.mouseOut();
            this.slotOver = temp;
            this.slotOver.mouseOver();
        } else if (temp) {
            this.slotOver = temp;
            this.slotOver.mouseOver();
        }
    }
    update(delta, unscaleDelta) {

        this.checkGridCollision();

        let targetY = Game.Screen.height / 2;
        if(Game.IsPortrait){
            targetY -= 250
        }
        this.cardsContainer.y = Utils.lerp(this.cardsContainer.y, targetY, 0.3);



        this.zero.x = this.input.localMousePosition.x - Game.Screen.width / 2
        this.zero.y = this.input.localMousePosition.y - Game.Screen.height / 2
        if (this.cardHolding) {
            this.cardHolding.rotation = Utils.angleLerp(this.cardHolding.rotation, 0, 0.5)

            this.cardHolding.x = this.input.localMousePosition.x - Game.Screen.width / 2
            this.cardHolding.y = this.input.localMousePosition.y - Game.Screen.height / 2
            
        }
        if (this.handCards.length) {

            let w = this.handCards[this.handCards.length - 1].x - this.handCards[0].x
            this.cardsContainer.x = Utils.lerp(this.cardsContainer.x, -w / 2, 0.3);
            let arc = 1
            let rotChunk = arc / this.handCards.length
            for (let index = this.handCards.length - 1; index >= 0; index--) {
                const element = this.handCards[index];
                element.update(unscaleDelta)
                element.x = Utils.lerp(element.x, 80 * index, 0.5)
                let rot = (rotChunk * index) - (arc / 2) + rotChunk / 2
                element.rotation = Utils.angleLerp(element.rotation, rot, 0.5)
                element.y = Utils.lerp(element.y, Math.cos(rot) * -200 + 200, 0.5)
            }

        }
    }
    disable() {
        super.disable();
        this.gameView.view.visible = false;
    }

    enable() {
        super.enable();
        this.cardHolding = null;
        this.slotOver = null;
        this.gameView.view.visible = true;
    }

    isPointInsideAABB(point, box) {
        return (
            point.x >= box.worldTransform.tx &&
            point.x <= box.worldTransform.tx + box.width &&
            point.y >= box.worldTransform.ty &&
            point.y <= box.worldTransform.ty + box.height
        )
    }
}