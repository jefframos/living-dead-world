import GameAgent from "../core/entity/GameAgent";
import GameViewSpriteSheet from "../components/GameViewSpriteSheet";
import Layer from "../core/Layer";
import Player from "./Player";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import Utils from "../core/utils/Utils";

export default class BaseEnemy extends GameAgent {
    constructor() {
        super();
        //this.setDebug(15)

        this.enemies = ['cat','dog','elephant','poney','rabbit','sheep']
        //this.enemies = ['tile_0122', 'tile_0109','tile_0110','tile_0111','tile_0112','tile_0120','tile_0121','tile_0122','tile_0123','tile_0124']
        this.gameView.view = new PIXI.Sprite()

    }
    build(radius = 15) {
        super.build();
        //this.view.scale.set(0.2)
        this.buildCircle(0, 0, 15);

        //this.gameView.view.texture = new PIXI.Texture.from(this.enemies[Math.floor(Math.random() * this.enemies.length)])       

        this.rigidBody.isSensor = false;
        this.layerCategory = Layer.Enemy
        this.layerMask = Layer.EnemyCollision

        

        //this.health.setNewHealth(9999999)
        this.speedAdjust = 0.5

        this.addComponent(SpriteJump).jumpHight = 10
        let spriteFacing = this.addComponent(SpriteFacing);
        spriteFacing.lerp = 1
        spriteFacing.startScaleX = -1

        let spriteSheet = this.addComponent(GameViewSpriteSheet);

        let animData1 = {}
        animData1[GameViewSpriteSheet.AnimationType.Idle] = {
            spriteName: 'goblin_idle_anim_f',
            params: {
                totalFramesRange: { min: 0, max: 5 }, time: 0.2, loop: true
            }
        }
        animData1[GameViewSpriteSheet.AnimationType.Running] = {
            spriteName: 'goblin_run_anim_f',
            params: {
                totalFramesRange: { min: 0, max: 5 }, time: 0.2, loop: true
            }
        }

        let animData2 = {}
        animData2[GameViewSpriteSheet.AnimationType.Idle] = {
            spriteName: 'fly_anim_f',
            params: {
                totalFramesRange: { min: 0, max: 3 }, time: 0.1, loop: true
            }
        }
        animData2[GameViewSpriteSheet.AnimationType.Running] = {
            spriteName: 'fly_anim_f',
            params: {
                totalFramesRange: { min: 0, max: 3 }, time: 0.1, loop: true
            }
        }

        let animData3 = {}
        animData3[GameViewSpriteSheet.AnimationType.Idle] = {
            spriteName: 'slime_idle_anim_f',
            params: {
                totalFramesRange: { min: 0, max: 5 }, time: 0.05, loop: true
            }
        }
        animData3[GameViewSpriteSheet.AnimationType.Running] = {
            spriteName: 'slime_run_anim_f',
            params: {
                totalFramesRange: { min: 0, max: 5 }, time: 0.05, loop: true
            }
        }

        this.enemies = [animData1, animData2, animData3]
        
        spriteSheet.setData(this.enemies[Math.floor(Math.random() * this.enemies.length)]);
        spriteSheet.update(0.1);

        this.gameView.view.anchor.set(0.5,1)
        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, 30));
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.view.scale.x = Math.abs(this.gameView.view.scale.x);
        this.gameView.applyScale();
    }
    destroy(){
        //console.log("DESTROY")

        super.destroy();
        //this.removeAllSignals();
    }
    update(delta) {

        if (!this.dying) {
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