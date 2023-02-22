import EffectsManager from "../manager/EffectsManager";
import EntityLifebar from "../components/ui/progressBar/EntityLifebar";
import FlashOnDamage from "../components/view/FlashOnDamage";
import GameAgent from "../core/entity/GameAgent";
import GameStaticData from "../data/GameStaticData";
import GameViewSpriteSheet from "../components/GameViewSpriteSheet";
import Layer from "../core/Layer";
import Player from "./Player";
import Pool from "../core/utils/Pool";
import Shadow from "../components/view/Shadow";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import WeaponBuilder from "../screen/WeaponBuilder";
import ZombieWalk from "../components/ZombieWalk";

export default class BaseEnemy extends GameAgent {
    constructor() {
        super();
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
        if (this.viewData.jumpHight) {
            this.addComponent(SpriteJump).jumpHight = this.viewData.jumpHight
        }



        let spriteFacing = this.addComponent(SpriteFacing);
        spriteFacing.lerp = 1
        spriteFacing.startScaleX = -1

        if (this.viewData.zombieWalk) {
            this.addComponent(ZombieWalk).speed = this.viewData.zombieWalk;
        }
        
        // let spriteSheet = this.addComponent(GameViewSpriteSheet);
        // let animData1 = {}
        // let run = GameStaticData.instance.getSharedDataById('animation', enemyData.animationData.run);
        // if (run) {
        //     animData1[GameViewSpriteSheet.AnimationType.Running] = run.animationData;
        // } else {
        //     animData1[GameViewSpriteSheet.AnimationType.Running] = animData1[GameViewSpriteSheet.AnimationType.Idle];
        // }
        // animData1[GameViewSpriteSheet.AnimationType.Idle] = GameStaticData.instance.getSharedDataById('animation', enemyData.animationData.idle).animationData

        // spriteSheet.setData(animData1);
        // spriteSheet.update(0.1);
        // spriteSheet.update(0.1);

        this.makeAnimations(this.staticData)

        if (this.viewData.anchor) {
            this.gameView.view.anchor.set(this.viewData.anchor.x, this.viewData.anchor.y)
        } else {
            this.gameView.view.anchor.set(0.5, 1)
        }

        let scale = this.viewData.scale ? this.viewData.scale : 1
        this.gameView.view.scale.set(Utils.scaleToFit(this.gameView.view, this.attributes.radius * 2 * scale));
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.view.scale.x = Math.abs(this.gameView.view.scale.x);
        this.gameView.applyScale();



        // this.lifeBar = this.engine.poolGameObject(EntityLifebar)
        // this.addChild(this.lifeBar)
        // this.lifeBar.build(this.attributes.radius * 2,5,2);



        let shadow = this.engine.poolGameObject(Shadow);
        this.addChild(shadow);
        //shadow.updateScale(scale);

        this.transform.position.y = 0;
        if (this.viewData.offset != undefined) {
            if (this.viewData.offset.y != undefined) {
                this.transform.position.y = this.viewData.offset.y
            }
        }



    }
    afterBuild() {
        super.afterBuild()
        //this.addWeaponData(WeaponBuilder.instance.weaponsData['LIGHTNING_IN_PLACE'])
    }
    destroy() {
        super.destroy();
    }
    update(delta) {

        if (!this.dying) {
            if (Vector3.distance(this.transform.position, Player.MainPlayer.transform.position) > 1000) {
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