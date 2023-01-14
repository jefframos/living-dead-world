import GameView from "../view/GameView";
import Health from "../../components/Health";
import PhysicsEntity from "../physics/PhysicsEntity";
import signals from "signals";

export default class GameAgent extends PhysicsEntity {
    constructor(debug = false) {
        super(debug);
        this.onDie = new signals.Signal();

        this.gameView = new GameView(this)
        this.totalDirections = 6
        this.dying = false;
        this.shadow = new PIXI.Sprite.from('shadow2')
        this.shadow.anchor.set(0.5, 0.5)
        this.shadow.alpha = 0.1
        this.shadow.tint = 0;
        this.shadow.scale.set(30 / this.shadow.width)
        this.shadow.scale.y = this.shadow.scale.x * 0.4
        
        this.currentEnemiesColliding = [];
        

        
        // this.view = new SpriteSheetAnimation()
        // this.view.anchor.set(0.5, 0.5)
        // this.view.animationFinish.add(this.onAnimationEnd.bind(this))

        // this.viewOffset.y = 0;

        if (debug) {
            this.setDebug(15)
        }

    }
    get isDead() { return this.health.currentHealth <= 0 }
    findInCollision(entity){
        for (let index = 0; index < this.currentEnemiesColliding.length; index++) {
            if(this.currentEnemiesColliding[index].entity == entity){
                return true;
            }
            
        }
        return false;
    }
    damage(value){
        this.health.damage(value);
    }
    die() {
        //console.log("DIE")
        this.rigidBody.isSensor = true;
        this.dying = true;
        this.onDie.dispatch(this);
        this.destroy()
    }
    onAnimationEnd(animation, state) { }
    start() {
        super.start();
        // this.view.visible = true;
    }
    build() {
        super.build();


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
    update(delta) {
        super.update(delta);

        this.gameView.update(delta)
        

        this.shadow.x = this.transform.position.x
        this.shadow.y = this.transform.position.z

        // if (this.view.init) {
        //     this.view.setLayer(this.calcFrame())
        //     this.view.update(delta)
        // }
    }
    injectAnimations(animations, flipped) {
        animations.forEach(element => {
            for (let index = this.totalDirections; index >= 1; index--) {
                let angId = Math.round(index * ((flipped?180:360) / this.totalDirections))
                this.view.addLayer(element.id, this.characterAnimationID + '_' + element.name + '_' + angId + '_', { min: 0, max: element.frames - 1 }, element.speed, element.loop)
            }
        });

        this.view.setLayer(0)
        this.view.randomStartFrame();
    }
    onRender() {
    }
    destroy() {
        super.destroy();

        //this.view.visible = false;
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