import BuildingComponent from "../components/building/BuildingComponent";
import DeckView from "../components/deckBuilding/DeckView";
import Eugine from "../core/Eugine";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import InputModule from "../core/modules/InputModule";
import Player from "../entity/Player";
import RenderModule from "../core/modules/RenderModule";
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


        console.log("building start here");
        //this.setBuildingMode();
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
        if(this.deckView.enabled){
            this.deckView.setActive(false);
            Eugine.PhysicsTimeScale = 1;
        }else{
            this.deckView.setActive(true);
            Eugine.PhysicsTimeScale = 0;            
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
        this.buildingPositions.i = Math.floor(Player.MainPlayer.transform.position.x / this.tileSize)
        this.buildingPositions.j = Math.floor(Player.MainPlayer.transform.position.y / this.tileSize)
        this.buildingPositions.x = Player.MainPlayer.transform.position.x;
        this.buildingPositions.y = Player.MainPlayer.transform.position.y;

        this.buildingPositions.mouseX = Math.floor((this.input.globalMousePos.x + Player.MainPlayer.transform.position.x - config.width / 2) / this.tileSize) * this.tileSize
        this.buildingPositions.mouseY = Math.floor((this.input.globalMousePos.y + Player.MainPlayer.transform.position.y - config.height / 2) / this.tileSize) * this.tileSize


        if (WorldSystem.CurrentMode == WorldSystem.BuildingMode) {
            this.buildingComponent.updateGridPosition(this.buildingPositions);
            this.buildingComponent.updateMousePosition(this.buildingPositions);
        }

    }
}