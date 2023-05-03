import BuildingComponent from "../components/building/BuildingComponent";
import CardPlacementSystem from "../components/deckBuilding/CardPlacementSystem";
import CardPlacementView from "../components/deckBuilding/CardPlacementView";
import EntityBuilder from "../screen/EntityBuilder";
import Eugine from "../core/Eugine";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import HudButtons from "../components/ui/HudButtons";
import InputModule from "../core/modules/InputModule";
import Player from "../entity/Player";
import PlayerInventoryHud from "../inventory/view/PlayerInventoryHud";
import PlayerSessionData from "../data/PlayerSessionData";
import RenderModule from "../core/modules/RenderModule";
import SurvivorDeckController from "../components/deckBuilding/SurvivorDeckController";
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

        this.entityBuilder = new EntityBuilder();
        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.RenderLayers.Building
        this.gameView.view = new PIXI.Container();

        this.playerSessionData = new PlayerSessionData();

        this.onPlayerReady = new signals.Signal();
        this.onPlayerDead = new signals.Signal();
        this.onGameStart = new signals.Signal();

        
    }
    build() {

        this.playerInventoryHud = this.engine.poolGameObject(PlayerInventoryHud, true)
        this.addChild(this.playerInventoryHud)


        this.deckView = this.engine.poolGameObject(SurvivorDeckController, true)
        this.deckView.setActive(false);
        this.addChild(this.deckView)

        this.hudButtons = this.engine.poolGameObject(HudButtons, true)

        this.hudButtons.addCallbackButton(() => {
            this.toggleDeck();
        }, config.assets.button.primarySquare)

        this.hudButtons.addCallbackButton(() => {
            this.player.clearWeapon();
        }, config.assets.button.warningSquare)
        
        this.addChild(this.hudButtons)

        this.cardPlacementView = this.engine.poolGameObject(CardPlacementView, true)
        this.cardPlacementView.setActive(false);
        this.addChild(this.cardPlacementView)

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
            if (this.entityBuilder) {
                this.entityBuilder.eraseWeapon()
            } else {

                this.entityBuilder.addWeapons(this.player)
            }

            this.playerSessionData.reset();
            this.player.sessionData = this.playerSessionData;

            this.playerInventoryHud.registerPlayer(this.player)

            this.cardPlacementSystem.setPlayer(this.player);
            this.cardPlacementSystem.setWeapons(this.entityBuilder);

            this.player.refreshEquipment();
            this.player.sessionData.onLevelUp.add(this.onPlayerLevelUp.bind(this))

            if (window.debugMode) {
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
    }
    setBuildingMode() {
        GameplaySessionController.CurrentMode = GameplaySessionController.BuildingMode;
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

        }

    }
    
}