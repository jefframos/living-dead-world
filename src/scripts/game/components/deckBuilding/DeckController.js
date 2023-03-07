import BaseButton from "../ui/BaseButton";
import CardView from "./CardView";
import EntityBuilder from "../../screen/EntityBuilder";
import EntityData from "../../data/EntityData";
import Game from "../../../Game";
import GameObject from "../../core/gameObject/GameObject";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../../core/view/GameView";
import GameplayItem from "../../data/GameplayItem";
import GridSlotView from "./grid/GridSlotView";
import GridView from "./grid/GridView";
import InputModule from "../../core/modules/InputModule";
import InteractableView from "../../view/card/InteractableView";
import Player from "../../entity/Player";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";
import conversionUtils from "../../../conversionUtils";
import signals from "signals";

export default class DeckController extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.UILayer;
        this.gameView.view = new PIXI.Container();


        this.handCards = [];
        this.gridArray = [];

        this.backShape = new PIXI.Graphics().beginFill(0xffffff).drawRect(-5000, -5000, 10000, 10000)
        this.gameView.view.addChild(this.backShape)
        this.backShape.tint = 0
        this.backShape.alpha = 0.3
        this.onConfirmLoudout = new signals.Signal();

        this.gridContainer = new PIXI.Container();
        this.cardsContainer = new PIXI.Container();
        this.transitionContainer = new PIXI.Container();

        this.gameView.view.addChild(this.gridContainer)
        this.gameView.view.addChild(this.cardsContainer)
        this.gameView.view.addChild(this.transitionContainer)

        this.fromGridCard = new CardView();
        this.transitionContainer.addChild(this.fromGridCard)
        this.fromGridCard.visible = false;

        this.localMousePosition = { x: 0, y: 0 }
        //this.gridContainer.y = -100

        this.offsetDeck = 0;

        InteractableView.addMouseDown(this.gameView.view, () => {
            //dont like this
            setTimeout(() => {
                this.checkGridCollision();
                if (this.gridView.slotOver) {
                    let slotData = this.player.sessionData.getEquipment(this.gridView.slotOver.i, this.gridView.slotOver.j)
                    if (!slotData || !slotData.item) {
                        return;
                    }
                    this.holdingData = slotData
                    this.originData.i = this.gridView.slotOver.i
                    this.originData.j = this.gridView.slotOver.j
                    this.gridView.slotOver.holding()
                    this.fromGridCard.setData(this.holdingData.item)
                    this.fromGridCard.visible = true;
                }
            }, 1);
        })
        InteractableView.addMouseUp(this.gameView.view, () => {
            this.gridView.mouseUp();
            if (this.gridView.slotOver) {
                this.gridView.slotOver.mouseOut();
            }
            if (!this.cardHolding) {
                if (this.holdingData) {
                    if (this.gridView.slotOver && this.gridView.slotOver.isTrash) {
                        this.player.sessionData.removeEquipment(this.originData.i, this.originData.j);
                    } else {
                        if (this.gridView.slotOver) {
                            let slotData = this.player.sessionData.getEquipment(this.gridView.slotOver.i, this.gridView.slotOver.j)
                            let onSlotEquipment = null;
                            if (slotData && slotData.item) {
                                onSlotEquipment = slotData
                            }
                            if (onSlotEquipment && onSlotEquipment.item.id == this.holdingData.item.id) {
                                
                                this.player.sessionData.addEquipment(this.holdingData, this.gridView.slotOver.i, this.gridView.slotOver.j);
                                //this.player.sessionData.addEquipment(onSlotEquipment, this.originData.i, this.originData.j);
                                this.player.sessionData.removeEquipment(this.originData.i, this.originData.j);
                                //this.player.sessionData.removeEquipment(this.gridView.slotOver.i, this.gridView.slotOver.j);
                            } else {
                                this.player.sessionData.addEquipment(this.holdingData, this.gridView.slotOver.i, this.gridView.slotOver.j);
                                if (onSlotEquipment) {
                                    this.player.sessionData.addEquipment(onSlotEquipment, this.originData.i, this.originData.j);
                                }else{
                                    this.player.sessionData.removeEquipment(this.originData.i, this.originData.j);
                                }

                            }

                        }
                    }
                    this.fromGridCard.visible = false;
                    this.holdingData = null;
                }

                this.gridView.slotOver = null;
                return;
            }
            this.cardHolding.interactive = true;
            if (this.gridView.slotOver) {
                this.cardHolding.parent.removeChild(this.cardHolding)

                let slotData = this.player.sessionData.getEquipment(this.gridView.slotOver.i, this.gridView.slotOver.j)
                let onSlotEquipment = null;
                if (slotData && slotData.item) {
                    onSlotEquipment = slotData
                }

                
                if (onSlotEquipment) {
                                        
                    if (onSlotEquipment && onSlotEquipment.item.id == this.holdingData.item.id) {
                        this.player.sessionData.addEquipment(this.holdingData, this.gridView.slotOver.i, this.gridView.slotOver.j);
                    } else {
                        this.player.sessionData.addEquipment(this.holdingData, this.gridView.slotOver.i, this.gridView.slotOver.j);
                        let nextSlot = this.player.sessionData.findEmptySlotAtCol(this.gridView.slotOver.i)
                        if (nextSlot) {
                            this.player.sessionData.addEquipment(onSlotEquipment, nextSlot.i, nextSlot.j);
                        } else {
                            nextSlot = this.player.sessionData.findEmptySlotAtLine(this.gridView.slotOver.j)
                            if (nextSlot) {
                                this.player.sessionData.addEquipment(onSlotEquipment, nextSlot.i, nextSlot.j);
                            } else {
                                nextSlot = this.player.sessionData.findAnyEmptySlot()
                                if (nextSlot) {
                                    this.player.sessionData.addEquipment(onSlotEquipment, nextSlot.i, nextSlot.j);
                                }
                            }
                        }
                    }
                }else{
                    let weaponData = EntityBuilder.instance.weaponsData[this.holdingData.id]

                    if (weaponData) {
                        this.player.sessionData.addEquipment(weaponData, this.gridView.slotOver.i, this.gridView.slotOver.j);
                    } else {
                        this.player.sessionData.addEquipment(this.holdingData, this.gridView.slotOver.i, this.gridView.slotOver.j);
                    }
    
                }
                //complete card drop
                this.openDeckButton.visible = true;
                this.cardHolding = null;
                this.offsetDeck = 300;

            } else {
                this.handCards.splice(this.cardHolding.id, 0, this.cardHolding);
            }
            this.cardHolding = null;
            for (let i = 0; i < this.handCards.length; i++) {
                this.handCards[i].id = i;
                this.cardsContainer.addChild(this.handCards[i]);
            }
            this.gridView.slotOver = null;
        })

        this.holdingData = null;
        this.originData = { i: -1, j: -1 };



        this.zero = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0, 0, 20)
        //this.gridContainer.addChild(this.zero);

        this.openDeckButton = new BaseButton('square_0002s', 200, 80);
        this.gameView.view.addChild(this.openDeckButton)
        this.openDeckButton.onButtonClicked.add(() => {
            this.onConfirmLoudout.dispatch();
        })
        this.openDeckButton.pivot.x = this.openDeckButton.width / 2;
        this.openDeckButton.y = 80
    }
    start() {
        super.start();
        this.input = this.engine.findByType(InputModule)

    }
    setPlayer(player) {
        this.player = player
        this.player.sessionData.equipmentUpdated.add(this.rebuildWeaponGrid.bind(this))

        if (!this.gridView) {
            this.gridView = new GridView();
        }
        this.gridView.makeGrid(this.player.sessionData.equipmentList)

        this.gridContainer.addChild(this.gridView);

        //this.gridContainer.pivot.x = this.gridContainer.width / 2
        //this.gridContainer.pivot.y = this.gridContainer.height / 2

        this.rebuildWeaponGrid(this.player.sessionData.equipmentList)
    }
    rebuildWeaponGrid(data) {

        this.gridView.updateEquipment(data);
    }
    buildCards(data) {

        for (let i = this.handCards.length - 1; i >= 0; i--) {
            if (this.handCards[i].parent) {
                this.handCards[i].parent.removeChild(this.handCards[i]);
            }

        }
        this.cardHolding = null;
        this.holdingData = null;
        this.gridView.slotOver = null;
        this.handCards = [];
        for (let i = 0; i < 3; i++) {
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
            }



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
                this.holdingData = new GameplayItem(card.cardData);
            })
            this.handCards.push(a)
            a.setData(dt, data[i]);
        }

        this.cardsContainer.y = Game.Screen.height / 2


    }
    build() {

    }
    checkGridCollision() {
        this.localMousePosition.x = this.input.localMousePosition.x - Game.Screen.width / 2 - this.gridContainer.x
        this.localMousePosition.y = this.input.localMousePosition.y - Game.Screen.height / 2 - this.gridContainer.y
        this.gridView.findMouseCollision(this.localMousePosition);
    }
    update(delta, unscaleDelta) {

        this.gridContainer.x = -this.gridContainer.width / 2 + 60
        this.gridContainer.y = -this.gridContainer.height / 2 - 100
        this.checkGridCollision();

        let targetY = Game.Screen.height / 2 + this.offsetDeck;
        if (Game.IsPortrait) {
            targetY -= 150;
        }


        this.cardsContainer.y = Utils.lerp(this.cardsContainer.y, targetY, 0.3);
        this.zero.x = this.input.localMousePosition.x - Game.Screen.width / 2 + 200
        this.zero.y = this.input.localMousePosition.y - Game.Screen.height / 2
        if (this.cardHolding) {
            this.cardHolding.rotation = Utils.angleLerp(this.cardHolding.rotation, 0, 0.5)
            this.cardHolding.x = this.input.localMousePosition.x - Game.Screen.width / 2
            this.cardHolding.y = this.input.localMousePosition.y - Game.Screen.height / 2
        }

        if (this.fromGridCard) {
            this.fromGridCard.rotation = Utils.angleLerp(this.fromGridCard.rotation, 0, 0.5)
            this.fromGridCard.x = this.input.localMousePosition.x - Game.Screen.width / 2
            this.fromGridCard.y = this.input.localMousePosition.y - Game.Screen.height / 2
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
        this.openDeckButton.visible = false;
        this.gameView.view.visible = true;
        this.offsetDeck = 0;
    }
}