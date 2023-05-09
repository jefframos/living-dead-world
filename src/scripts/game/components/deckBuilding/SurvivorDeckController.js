import BaseButton from "../ui/BaseButton";
import CardInfo from "./CardInfo";
import CardView from "./CardView";
import EntityBuilder from "../../screen/EntityBuilder";
import EntityData from "../../data/EntityData";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../../core/view/GameView";
import GameplayItem from "../../data/GameplayItem";
import GridInfoView from "./GridInfoView";
import GridSlotView from "./grid/GridSlotView";
import GridView from "./grid/GridView";
import InputModule from "../../core/modules/InputModule";
import InteractableView from "../../view/card/InteractableView";
import Player from "../../entity/Player";
import RenderModule from "../../core/modules/RenderModule";
import SpriteButton from "../ui/SpriteButton";
import UIUtils from "../../core/utils/UIUtils";
import Utils from "../../core/utils/Utils";
import conversionUtils from "../../../conversionUtils";
import signals from "signals";

export default class SurvivorDeckController extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.UILayerOverlay;
        this.gameView.view = new PIXI.Container();


        this.backShape = new PIXI.Graphics().beginFill(0xffffff).drawRect(-5000, -5000, 10000, 10000)
        this.gameView.view.addChild(this.backShape)
        this.backShape.tint = 0
        this.backShape.alpha = 0.3
        this.onConfirmLoudout = new signals.Signal();

        this.gridContainer = new PIXI.Container();
        this.cardsContainer = new PIXI.Container();
        this.cardsContainer.sortableChildren = true;
        this.transitionContainer = new PIXI.Container();

        this.gameView.view.addChild(this.gridContainer)
        this.gameView.view.addChild(this.cardsContainer)
        this.gameView.view.addChild(this.transitionContainer)

        this.handCards = [];

        this.highlightedCard = null;

        this.cardWidth = 130
        this.cardHeight = 200
        this.cardDistance = 90
        this.cardContainerMaxWidth = 350

        this.state = 0;
    }

    start() {
        super.start();
        this.input = this.engine.findByType(InputModule)
        this.highlightedCard = null;
    }
    setPlayer(player) {
        this.player = player
        this.player.sessionData.equipmentUpdated.add(this.rebuildWeaponGrid.bind(this))
        this.rebuildWeaponGrid(this.player.sessionData.equipmentList)
    }
    rebuildWeaponGrid(data) {

        //this.gridView.updateEquipment(data);
    }
    buildCards(data, totalCards = 3) {

        for (let i = this.handCards.length - 1; i >= 0; i--) {
            if (this.handCards[i].parent) {
                this.handCards[i].parent.removeChild(this.handCards[i]);
            }

        }
        this.cardHolding = null;
        this.holdingData = null;
        //this.gridView.slotOver = null;
        this.handCards = [];
        for (let i = 0; i < totalCards; i++) {
            let dt = null
            switch (data[i].entityData.type) {
                case EntityData.EntityDataType.Weapon:

                    dt = EntityBuilder.instance.getWeapon(data[i].weaponId)
                    break;
                case EntityData.EntityDataType.Companion:
                    dt = EntityBuilder.instance.getCompanion(data[i].companionId)

                    break;
                case EntityData.EntityDataType.Attribute:
                    dt = EntityBuilder.instance.getAttribute(data[i].attributeId)

                    break;
                case EntityData.EntityDataType.Acessory:
                    dt = EntityBuilder.instance.getAcessory(data[i].acessoryId)

                    break;
                    case EntityData.EntityDataType.WeaponAttachment:
                    dt = EntityBuilder.instance.getWeapon(data[i].weaponId)
                    dt.setAsAttachment();
                    break;
            }



            let cardView = new CardView('square_0006', this.cardWidth, this.cardHeight);
            this.cardsContainer.addChild(cardView);
            cardView.id = i;
            cardView.zIndex = i;
            cardView.onCardClicked.add((card) => {
                //this.onCardClicked.dispatch(card.cardData)
                //card.visible = false;
                if (this.state == 0) {
                    this.state = 1;
                    this.highlightCard(card)
                } else {
                    if (this.highlightedCard == card) {
                        this.state = 0;
                        this.returnHighlighted();
                    } else {
                        this.returnHighlighted();
                        this.highlightCard(card)
                    }
                }

            })
            cardView.onCardConfirmed.add((card) => {
                this.pickCard(card);
            })
            this.handCards.push(cardView)
            cardView.setData(dt, data[i]);
        }

        this.cardsContainer.y = Game.Screen.height / 2
        this.cardsContainer.x = Game.Screen.width / 2
        //this.cardsContainer.addChild(UIUtils.getCircle());

    }
    pickCard(card) {
        //this.player.sessionData.addEquipment

        console.log(this.holdingData)

        let weaponData = EntityBuilder.instance.weaponsData[this.holdingData.id]

        if (weaponData) {
            this.player.sessionData.addEquipmentNEW(weaponData);
        } else {
            this.player.sessionData.addEquipmentNEW(this.holdingData.clone());
        }

        this.state = 0;
        this.destroyHighlighted();

        this.onConfirmLoudout.dispatch()

    }
    highlightCard(card) {
        this.highlightedCard = card;
        this.holdingData = card.cardData
        this.highlightedCard.highlight();
        this.transitionContainer.addChild(card)
        this.handCards = this.handCards.filter(item => item !== card);
    }
    returnHighlighted() {
        this.highlightedCard.unhighlight();
        this.highlightedCard.zIndex = this.highlightedCard.id
        this.handCards.splice(this.highlightedCard.id, 0, this.highlightedCard);
        this.holdingData = null
        this.cardsContainer.addChild(this.highlightedCard)
        this.highlightedCard = null;

    }
    destroyHighlighted() {
        if (!this.highlightedCard || !this.highlightedCard.parent) {
            return;
        }
        this.highlightedCard.parent.removeChild(this.highlightedCard)
        this.holdingData = null
        this.highlightedCard = null;
    }
    update(delta, unscaleDelta) {

        if (this.highlightedCard != null) {
            this.highlightedCard.update(delta)
        }
        if (this.handCards.length) {
            let arc = 1
            let rotChunk = arc / this.handCards.length

            const dist = Math.min(this.cardDistance * this.handCards.length, this.cardContainerMaxWidth) / this.handCards.length;
            for (let index = this.handCards.length - 1; index >= 0; index--) {
                const element = this.handCards[index];
                element.update(unscaleDelta)
                let rot = (rotChunk * index) - (arc / 2) + rotChunk / 2
                element.rotation = Utils.angleLerp(element.rotation, rot, 0.5)

                let extraH = 150;
                if (this.state == 1) {
                    extraH = 250;
                }

                element.y = Utils.lerp(element.y, Math.cos(rot) * -this.cardContainerMaxWidth + this.cardContainerMaxWidth + extraH, 0.25)
                element.x = Utils.lerp(element.x, dist * index - (dist * this.handCards.length / 2 - dist * 0.5), 0.5)
            }

        }

        if (this.state == 1) {
            this.highlightedCard.x = Utils.lerp(this.highlightedCard.x, 0, 0.5)
            this.highlightedCard.y = Utils.lerp(this.highlightedCard.y, 0, 0.5)
            this.highlightedCard.rotation = Utils.angleLerp(this.highlightedCard.rotation, 0, 0.5)

        }

        this.cardsContainer.x = Game.Borders.width * 0.5
        this.cardsContainer.y = Game.Borders.height * 0.5
        this.transitionContainer.x = this.cardsContainer.x;
        this.transitionContainer.y = this.cardsContainer.y;



        this.backShape.alpha = Utils.lerp(this.backShape.alpha, 0.4, 0.1)

    }
    aspectChange(isPortrait) {
        if (isPortrait) {
            this.cardsContainer.scale.set(1.5)
            this.transitionContainer.scale.set(1.5)
        } else {
            this.cardsContainer.scale.set(1)
            this.transitionContainer.scale.set(1)
        }
    }
    resize() {

        this.cardsContainer.x = Game.Borders.width * 0.5
    }

    disable() {
        super.disable();
        this.gameView.view.visible = false;
    }

    enable() {
        super.enable();
        this.backShape.alpha = 0;
        this.gameView.view.visible = true;
    }
}