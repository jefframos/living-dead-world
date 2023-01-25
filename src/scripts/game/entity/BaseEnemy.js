import GameAgent from "../core/entity/GameAgent";
import GameViewSpriteSheet from "../components/GameViewSpriteSheet";
import Layer from "../core/Layer";
import Player from "./Player";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import ZombieWalk from "../components/ZombieWalk";

export default class BaseEnemy extends GameAgent {
    constructor() {
        super();
        //this.setDebug(15)

        this.enemies = ['cat', 'dog', 'elephant', 'poney', 'rabbit', 'sheep']
        //this.enemies = ['tile_0122', 'tile_0109','tile_0110','tile_0111','tile_0112','tile_0120','tile_0121','tile_0122','tile_0123','tile_0124']
        this.gameView.view = new PIXI.Sprite()

    }
    build(enemyData) {
        super.build();

        this.staticData = enemyData;
        this.attributes = enemyData.attributes;        
        this.viewData = enemyData.view;        
        
        this.buildCircle(0, 0, this.attributes.radius);
        this.rigidBody.isSensor = false;
        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.EnemyCollision



        this.speed = this.attributes.speed;
        this.health.setNewHealth(this.attributes.hp)     

        //view related attributes
        if(this.viewData.jumpHight){
            this.addComponent(SpriteJump).jumpHight = this.viewData.jumpHight
        }
        let spriteFacing = this.addComponent(SpriteFacing);
        spriteFacing.lerp = 1
        spriteFacing.startScaleX = -1

        let spriteSheet = this.addComponent(GameViewSpriteSheet);
        if(this.viewData.zombieWalk){
            this.addComponent(ZombieWalk).speed = this.viewData.zombieWalk;
        }
        let animData1 = {}
        animData1[GameViewSpriteSheet.AnimationType.Idle] = enemyData.animationData.idle
        animData1[GameViewSpriteSheet.AnimationType.Running] = enemyData.animationData.running

        spriteSheet.setData(animData1);
        spriteSheet.update(0.1);

        if(this.viewData.anchor){
            this.gameView.view.anchor.set(this.viewData.anchor.x,this.viewData.anchor.y)
        }else{
            this.gameView.view.anchor.set(0.5, 1)
        }
        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, this.attributes.radius * 2 * (this.viewData.scale?this.viewData.scale:1)));
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.view.scale.x = Math.abs(this.gameView.view.scale.x);
        this.gameView.applyScale();

        this.transform.position.y = this.viewData.offsetY
    }
    destroy() {
        super.destroy();
    }
    update(delta) {

        if (!this.dying) {
            if(Vector3.distance(this.transform.position, Player.MainPlayer.transform.position) > 1000){
                this.destroy();
            }
            this.timer += delta * (this.speed * delta * Math.random())
            
            let dir = Math.atan2(Player.MainPlayer.transform.position.z - this.transform.position.z, Player.MainPlayer.transform.position.x - this.transform.position.x)//this.timer
            this.physics.velocity.x = Math.cos(dir) * this.speed * this.speedAdjust * delta
            this.physics.velocity.z = Math.sin(dir) * this.speed * this.speedAdjust * delta

        } else {
            this.physics.velocity.x = 0
            this.physics.velocity.z = 0
        }

        super.update(delta)
    }
}