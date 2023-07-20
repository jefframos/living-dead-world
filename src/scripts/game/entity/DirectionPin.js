import Camera from "../core/Camera";
import Game from "../../Game";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import Layer from "../core/Layer";
import LevelManager from "../manager/LevelManager";
import Player from "./Player";
import RenderModule from "../core/modules/RenderModule";
import Shadow from "../components/view/Shadow";
import TagManager from "../core/TagManager";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";

export default class DirectionPin extends GameObject {
    constructor() {
        super();

        this.gameView = new GameView(this);
        this.gameView.view = new PIXI.Sprite()
        this.gameView.layer = RenderModule.RenderLayers.FrontLayer;
    }
    build(params) {
        super.build()


        this.gameView.view.texture = PIXI.Texture.from('pin-arrow');
        this.gameView.view.anchor.set(1, 0.5)

        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, 30))

    }
    start() {
        super.start();

        this.player = this.engine.findByType(Player);

        if (!this.player) {
            this.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];
            });
        }

    }
    update(delta) {
        super.update(delta);
        if (!this.player) {
            return
        }
        this.gameView.update(delta)

        // this.gameView.view.visible = true;
        // this.transform.position = new Vector3(this.player.transform.position.x + Camera.ViewportSize.width / 2 - 50, 0, this.player.transform.position.z  )
        // //this.transform.position = new Vector3(this.player.transform.position.x + Camera.ViewportSize.width / 2, 0, this.player.transform.position.z  + Camera.ViewportSize.height / 2)
        // return;

        //this debugs the position and blablabla
        // if(this.lala){
        //     this.gameView.view.visible = true;

        //     //console.log(Camera.ViewportSize.width, Camera.Zoom)

        //     this.transform.position.x = this.player.transform.position.x + (this.lala2? Camera.ViewportSize.width / 2 : 0 )//* Camera.Zoom
        //     this.transform.position.z = this.player.transform.position.z + (this.lala3? Camera.ViewportSize.height / 2 : 0)//+ LevelManager.instance.destroyDistanceV2.y

        //     return;
        // }

        const enemy = LevelManager.instance.findClosestEnemyWithHigherTier(this.player.transform.position)
        if (enemy) {
            let distance = Vector3.distance(this.player.transform.position, enemy.transform.position);
            const angle = Vector3.atan2XZ(enemy.transform.position, this.player.transform.position)

            if (distance < Camera.ViewportSize.min / 2.1) {
                this.gameView.view.visible = false;
                return;
            } else {
                distance = Math.min(distance, (Camera.ViewportSize.min / 2 - 100) + Math.sin(Game.Time * 4) * 4 - 50)
            }
            const lerp = this.gameView.view.visible ? 0.3 : 1;
            this.gameView.view.rotation = Utils.angleLerp(this.gameView.view.rotation, angle, lerp)

            this.transform.position.x = Utils.lerp(this.transform.position.x, this.player.transform.position.x + Math.cos(angle) * distance, lerp)
            this.transform.position.z = Utils.lerp(this.transform.position.z, this.player.transform.position.z + Math.sin(angle) * distance, lerp)

            this.transform.position.y = Math.cos(Game.Time * 2) * 10 - 10

            this.gameView.view.visible = true;

        } else {
            this.gameView.view.visible = false;

        }
    }
    onRender() {
    }
}