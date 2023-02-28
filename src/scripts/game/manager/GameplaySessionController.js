import BuildingComponent from "../components/building/BuildingComponent";
import CardPlacementSystem from "../components/deckBuilding/CardPlacementSystem";
import CardPlacementView from "../components/deckBuilding/CardPlacementView";
import DeckController from "../components/deckBuilding/DeckController";
import Eugine from "../core/Eugine";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import HudButtons from "../components/ui/HudButtons";
import InputModule from "../core/modules/InputModule";
import Player from "../entity/Player";
import RenderModule from "../core/modules/RenderModule";
import WeaponBuilder from "../screen/WeaponBuilder";
import config from "../../config";
import signals from "signals";

export default class GameplaySessionController extends GameObject {
    static CurrentMode = 0;
    static CombatMode = 0;
    static BuildingMode = 1;


    constructor() {
        super()
        this.buildingPositions = { x: 0, y: 0, i: 0, j: 0 };
        this.tileSize = 45
        
        this.weaponBuilder = new WeaponBuilder();
        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.Building
        this.gameView.view = new PIXI.Container();

        this.onPlayerReady = new signals.Signal();
        this.onPlayerDead = new signals.Signal();
        this.onGameStart = new signals.Signal();
    }
    build() {

        this.buildingComponent = this.addComponent(BuildingComponent)
        this.buildingComponent.setGameView(this.gameView.view);


        this.deckView = this.engine.poolGameObject(DeckController, true)
        this.deckView.setActive(false);

        this.hudButtons = this.engine.poolGameObject(HudButtons, true)
        
        this.hudButtons.addCallbackButton(()=>{
            this.toggleDeck();
        }, config.assets.button.primarySquare)

        this.hudButtons.addCallbackButton(()=>{
            this.player.clearWeapon();
        }, config.assets.button.warningSquare)

        this.cardPlacementView = this.engine.poolGameObject(CardPlacementView, true)
        this.cardPlacementView.setActive(false);

        this.cardPlacementSystem = new CardPlacementSystem(this.deckView, this.cardPlacementView);
        this.cardPlacementSystem.onHide.add(this.onHidePanel.bind(this))

        this.player = this.engine.findByType(Player);

        if (!this.player) {
            this.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];
            });
        }
        //this.setBuildingMode();
        //this.toggleDeck();
    }
    playerReady() {
    
        setTimeout(() => {       
            if(this.weaponBuilder){
                this.weaponBuilder.eraseWeapon()
            } else{

                this.weaponBuilder.addWeapons(this.player)
            }  
            this.cardPlacementSystem.setPlayer(this.player);
            this.cardPlacementSystem.setWeapons(this.weaponBuilder);
            this.player.refreshEquipment();

            this.player.sessionData.onLevelUp.add(this.onPlayerLevelUp.bind(this))

            if(window.debugMode){                
                this.toggleDeck();
            }
        }, 1);
    }
    onPlayerLevelUp(xpData) {
        this.cardPlacementSystem.show();
        Eugine.TimeScale = 0;
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
    onHidePanel() {
        Eugine.TimeScale = 1;
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
        if (GameplaySessionController.CurrentMode == GameplaySessionController.CombatMode) {
            this.setBuildingMode();
        } else {
            this.setCombatMode();
        }
    }
    setCombatMode() {
        GameplaySessionController.CurrentMode = GameplaySessionController.CombatMode;
        this.buildingComponent.hide();
    }
    setBuildingMode() {
        GameplaySessionController.CurrentMode = GameplaySessionController.BuildingMode;
        this.buildingComponent.show();
    }
    update(delta) {

        if (!Player.MainPlayer) return;


        if (GameplaySessionController.CurrentMode == GameplaySessionController.BuildingMode) {
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