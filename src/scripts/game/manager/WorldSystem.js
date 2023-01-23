import BuildingComponent from "../components/building/BuildingComponent";
import CardPlacementSystem from "../components/deckBuilding/CardPlacementSystem";
import CardPlacementView from "../components/deckBuilding/CardPlacementView";
import DeckView from "../components/deckBuilding/DeckView";
import Eugine from "../core/Eugine";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import InputModule from "../core/modules/InputModule";
import Player from "../entity/Player";
import RenderModule from "../core/modules/RenderModule";
import WeaponBuilder from "../screen/WeaponBuilder";
import config from "../../config";

export default class WorldSystem extends GameObject {
    static CurrentMode = 0;
    static CombatMode = 0;
    static BuildingMode = 1;


    constructor() {
        super()
        this.buildingPositions = { x: 0, y: 0, i: 0, j: 0 };
        this.tileSize = 45

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.Building
        this.gameView.view = new PIXI.Container();
    }
    build() {

        this.buildingComponent = this.addComponent(BuildingComponent)
        this.buildingComponent.setGameView(this.gameView.view);


        this.deckView = this.engine.poolGameObject(DeckView, true)
        this.deckView.setActive(false);

        this.cardPlacementView = this.engine.poolGameObject(CardPlacementView, true)
        this.cardPlacementView.setActive(false);

        this.cardPlacementSystem = new CardPlacementSystem(this.deckView, this.cardPlacementView);

        this.player = this.engine.findByType(Player);

        if (!this.player) {
            this.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];
                this.playerReady();
            });
        }
        //this.setBuildingMode();
        //this.toggleDeck();
    }
    playerReady() {
        //wait one frame
        setTimeout(() => {            
            this.weaponBuilder = new WeaponBuilder();
            this.weaponBuilder.addWeapons(this.player)
            this.cardPlacementSystem.setPlayer(this.player);
            this.cardPlacementSystem.setWeapons(this.weaponBuilder);
            this.player.refreshEquipment();
        }, 1);
    }
    start() {
        this.input = this.engine.findByType(InputModule);
        this.input.onKeyUp.add((e) => {
            if (e.keyCode == 81) {
                this.toggleBuilding();
            }

            if (e.keyCode == 49) {

                this.toggleDeck();
            }
        })
    }
    toggleDeck() {
        if (!this.cardPlacementSystem.enabled) {
            this.cardPlacementSystem.show();
            Eugine.TimeScale = 0;
        } else {
            this.cardPlacementSystem.hide();
            Eugine.TimeScale = 1;

        }
    }
    toggleBuilding() {
        if (WorldSystem.CurrentMode == WorldSystem.CombatMode) {
            this.setBuildingMode();
        } else {
            this.setCombatMode();
        }
    }
    setCombatMode() {
        WorldSystem.CurrentMode = WorldSystem.CombatMode;
        this.buildingComponent.hide();
    }
    setBuildingMode() {
        WorldSystem.CurrentMode = WorldSystem.BuildingMode;
        this.buildingComponent.show();
    }
    update(delta) {

        if (!Player.MainPlayer) return;


        if (WorldSystem.CurrentMode == WorldSystem.BuildingMode) {
            this.buildingPositions.i = Math.floor(Player.MainPlayer.transform.position.x / this.tileSize)
            this.buildingPositions.j = Math.floor(Player.MainPlayer.transform.position.y / this.tileSize)
            this.buildingPositions.x = Player.MainPlayer.transform.position.x;
            this.buildingPositions.y = Player.MainPlayer.transform.position.y;

            this.buildingPositions.mouseX = Math.floor((this.input.globalMousePos.x + Player.MainPlayer.transform.position.x - config.width / 2) / this.tileSize) * this.tileSize
            this.buildingPositions.mouseY = Math.floor((this.input.globalMousePos.y + Player.MainPlayer.transform.position.y - config.height / 2) / this.tileSize) * this.tileSize

            this.buildingPositions.mouseX = this.input.globalMousePos.x + Player.MainPlayer.transform.position.x - config.width / 2
            this.buildingPositions.mouseY = this.input.globalMousePos.y + Player.MainPlayer.transform.position.y - config.height / 2

            this.buildingComponent.updateGridPosition(this.buildingPositions);
            this.buildingComponent.updateMousePosition(this.buildingPositions);
        }

    }
}