import EffectsManager from "../../manager/EffectsManager";
import FlashOnDamage from "../../components/view/FlashOnDamage";
import GameStaticData from "../../data/GameStaticData";
import GameView from "../view/GameView";
import GameViewSpriteSheet from "../../components/GameViewSpriteSheet";
import Health from "../../components/Health";
import InGameWeapon from "../../data/InGameWeapon";
import PhysicsEntity from "../physics/PhysicsEntity";
import signals from "signals";

export default class GameAgent extends PhysicsEntity {
    constructor(debug = false) {
        super(debug);
        this.onDie = new signals.Signal();

        this.gameView = new GameView(this)
        this.totalDirections = 6
        this.dying = false;
        this.staticData = {};
        this.currentEnemiesColliding = [];
        this.invencibleSpawnTime = 0;

        if (debug) {
            this.setDebug(15)
        }        

    }
    get isDead() { return this.health.currentHealth <= 0 }
    findInCollision(entity) {
        for (let index = 0; index < this.currentEnemiesColliding.length; index++) {
            if (this.currentEnemiesColliding[index].entity == entity) {
                return true;
            }

        }
        return false;
    }

    die() {
        super.die();
    }
    addWeaponData(weaponData) {

        let mainWeapon = new InGameWeapon();
        mainWeapon.addWeapon(weaponData)
        this.addWeapon(mainWeapon)
    }
    addWeapon(inGameWeapon) {
        if (!inGameWeapon.hasWeapon) {
            return;
        }
        let weaponData = inGameWeapon.mainWeapon
        let weapon = this.engine.poolGameObject(weaponData.customConstructor)
        this.addChild(weapon)
        weapon.build(weaponData)
    }
    damage(value) {
        if(this.invencibleSpawnTime > 0){
            return this.health.currentHealth;
        }
        EffectsManager.instance.popDamage(this, value)
        this.playVfx('onHit')
        return this.health.damage(value);
    }
    die() {
        if (this.dying) {
            return;
        }

        this.playVfx('onDie')
        this.rigidBody.isSensor = true;
        this.dying = true;
        this.onDie.dispatch(this);
        this.destroy()
    }
    playVfx(type) {
        if (!this.staticData || !this.staticData.vfx || !this.staticData.vfx[type]) { return }
        let centerPosition = this.gameView.view.position
        //centerPosition.x -= (this.gameView.view.anchor.x * this.gameView.view.width) + (this.gameView.view.width * 0.5)
        //centerPosition.y -= (this.gameView.view.anchor.y * this.gameView.view.height) + (this.gameView.view.height * 0.5)
        EffectsManager.instance.emitById(this.gameView.view.position, this.staticData.vfx[type])
    }

    onAnimationEnd(animation, state) { }
    start() {
        super.start();
        // this.view.visible = true;
    }
    build() {
        super.build();

        this.invencibleSpawnTime = 0.5;

        this.health = this.addComponent(Health)
        this.health.removeAllSignals();

        this.health.gotKilled.add(this.die.bind(this))
        this.health.reset()

        this.angleChunk = 360 / this.totalDirections;
        this.angleChunkRad = Math.PI * 2 / this.totalDirections;
        this.timer = Math.random()
        this.speed = 20 * Math.random() + 10
        this.speedAdjust = 1;
        this.dying = false;

        
        
    }
    afterBuild(){        
        super.afterBuild();
        this.flashOnDamage = this.addComponent(FlashOnDamage);
    }
    update(delta) {
        super.update(delta);
        if(this.invencibleSpawnTime > 0){
            this.invencibleSpawnTime -= delta;
        }
    }
  
    onRender() {
    }
    destroy() {
        if (this.isDestroyed) return;
        super.destroy();
    }

    calcFrame() {
        let ang = (this.transform.angle) * 180 / Math.PI + 90

        if (ang < 0 || ang > 180) {
            this.view.scale.x = -Math.abs(this.view.scale.x)
        } else {
            this.view.scale.x = Math.abs(this.view.scale.x)
        }

        ang = Math.abs(ang)
        if (ang > 180) {
            ang = 180 - ang % 180
        }
        let layer = Math.floor(ang / (180 / this.totalDirections))
        if (layer < 0) {
            layer += this.totalDirections
        }
        layer %= this.totalDirections
        return layer;
    }

    makeAnimations(data){
        let spriteSheet = this.addComponent(GameViewSpriteSheet);
        let animData1 = {} 
        animData1[GameViewSpriteSheet.AnimationType.Idle] = GameStaticData.instance.getSharedDataById('animation', data.animationData.idle).animationData
        
        let run = data.animationData.run ? GameStaticData.instance.getSharedDataById('animation', data.animationData.run) : null;
        if (run) {
            animData1[GameViewSpriteSheet.AnimationType.Running] = run.animationData;
        } else {
            animData1[GameViewSpriteSheet.AnimationType.Running] = animData1[GameViewSpriteSheet.AnimationType.Idle];
        }

        spriteSheet.setData(animData1);
        spriteSheet.update(0.1);

        
    }
    // calcFrame() {
    //     //aif(this.physics.magnitude == 0) return -1;

    //     let ang = ((this.transform.angle) * 180 / Math.PI) + (360 / this.totalDirections) * 0.5
    //     if (ang <= 0) {
    //         ang += 360
    //     }
    //     let layer = Math.round(ang / (360 / this.totalDirections)) + 1
    //     if (layer < 0) {
    //         layer += this.totalDirections
    //     }
    //     layer %= this.totalDirections

    //     return layer;
    // }
}